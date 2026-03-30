<?php
/**
 * Database backup and restore class
 *
 * @package Urumi_WP_Cloner
 */

if (!defined('ABSPATH')) {
    exit;
}

class Urumi_Cloner_Database {

    /**
     * Export database to SQL file
     */
    public static function export($output_file) {
        return self::export_with_php($output_file);
    }

    private static function export_with_php($output_file) {
        global $wpdb;

        try {
            $handle = fopen($output_file, 'w');
            if (!$handle) {
                return new WP_Error(
                    'file_open_failed',
                    sprintf(__('Failed to open file for writing: %s', 'urumi-wp-cloner'), $output_file)
                );
            }

            fwrite($handle, "-- Urumi WP Cloner Database Backup\n");
            fwrite($handle, "-- Date: " . date('Y-m-d H:i:s') . "\n\n");
            fwrite($handle, "SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\n");
            fwrite($handle, "SET time_zone = \"+00:00\";\n\n");

            $tables = $wpdb->get_results('SHOW TABLES', ARRAY_N);
            $table_count = count($tables);

            $current_table = 0;

            foreach ($tables as $table) {
                $table_name = $table[0];
                $current_table++;

                $create_table = $wpdb->get_row("SHOW CREATE TABLE `{$table_name}`", ARRAY_N);
                if (!$create_table) {
                    fclose($handle);
                    return new WP_Error(
                        'table_structure_failed',
                        sprintf(__('Failed to get structure for table: %s', 'urumi-wp-cloner'), $table_name)
                    );
                }

                fwrite($handle, "\n\n-- Table structure for `{$table_name}`\n\n");
                fwrite($handle, "DROP TABLE IF EXISTS `{$table_name}`;\n");
                fwrite($handle, $create_table[1] . ";\n\n");
                fwrite($handle, "-- Data for table `{$table_name}`\n\n");

                $row_count = $wpdb->get_var("SELECT COUNT(*) FROM `{$table_name}`");

                // Use cursor-based pagination for better performance
                $primary_key = self::get_primary_key($table_name);
                $batch_size = 1000;
                $last_id = null;
                $total_exported = 0;
                $batch_num = 0;

                while (true) {
                    $batch_num++;

                    if ($primary_key && $last_id !== null) {
                        $rows = $wpdb->get_results(
                            $wpdb->prepare(
                                "SELECT * FROM `{$table_name}` WHERE `{$primary_key}` > %s ORDER BY `{$primary_key}` ASC LIMIT %d",
                                $last_id,
                                $batch_size
                            ),
                            ARRAY_A
                        );
                    } else {
                        $rows = $wpdb->get_results(
                            $wpdb->prepare(
                                "SELECT * FROM `{$table_name}` LIMIT %d",
                                $batch_size
                            ),
                            ARRAY_A
                        );
                    }

                    if ($wpdb->last_error) {
                        fclose($handle);
                        return new WP_Error(
                            'query_failed',
                            sprintf(
                                __('Database query failed for table %s: %s', 'urumi-wp-cloner'),
                                $table_name,
                                $wpdb->last_error
                            )
                        );
                    }

                    if (empty($rows)) {
                        break;
                    }

                    $batch_row_count = count($rows);
                    $total_exported += $batch_row_count;

                    foreach ($rows as $row) {
                        $columns = array_keys($row);
                        $values = array_values($row);

                        if ($primary_key && isset($row[$primary_key])) {
                            $last_id = $row[$primary_key];
                        }

                        $escaped_values = array_map(function ($value) use ($wpdb) {
                            if ($value === null) {
                                return 'NULL';
                            }
                            $escaped = $wpdb->_real_escape($value);
                            $escaped = str_replace(array("\r\n", "\r", "\n", "\t"), array('\r\n', '\r', '\n', '\t'), $escaped);
                            return "'" . $escaped . "'";
                        }, $values);

                        $sql = sprintf(
                            "INSERT INTO `%s` (`%s`) VALUES (%s);\n",
                            $table_name,
                            implode('`, `', $columns),
                            implode(', ', $escaped_values)
                        );

                        $write_result = fwrite($handle, $sql);
                        if ($write_result === false) {
                            fclose($handle);
                            return new WP_Error(
                                'file_write_failed',
                                sprintf(
                                    __('Failed to write data for table %s to file', 'urumi-wp-cloner'),
                                    $table_name
                                )
                            );
                        }
                    }

                    unset($rows);

                    if (!$primary_key) {
                        break;
                    }
                }
            }

            fclose($handle);

            if (!file_exists($output_file)) {
                return new WP_Error('file_not_created', __('Output file was not created', 'urumi-wp-cloner'));
            }

            if (filesize($output_file) === 0) {
                return new WP_Error('empty_file', __('Output file is empty', 'urumi-wp-cloner'));
            }

            return true;

        } catch (Exception $e) {
            if (isset($handle) && $handle) {
                fclose($handle);
            }

            return new WP_Error('export_exception', $e->getMessage());
        }
    }

    /**
     * Import database from SQL file
     */
    public static function import($sql_file, $progress_callback = null) {
        global $wpdb;

        if (!file_exists($sql_file)) {
            return new WP_Error('file_not_found', __('SQL file not found.', 'urumi-wp-cloner'));
        }

        $file_size = filesize($sql_file);
        if ($file_size === 0) {
            return new WP_Error('empty_file', __('SQL file is empty.', 'urumi-wp-cloner'));
        }

        @set_time_limit(0);
        @ini_set('memory_limit', '512M');

        $handle = fopen($sql_file, 'r');
        if (!$handle) {
            return new WP_Error('file_open_failed', __('Failed to open SQL file.', 'urumi-wp-cloner'));
        }

        $wpdb->query('SET FOREIGN_KEY_CHECKS=0');
        $wpdb->query('SET UNIQUE_CHECKS=0');
        $wpdb->query('SET AUTOCOMMIT=0');
        $wpdb->query('SET SQL_MODE=""');
        $wpdb->query('SET NAMES utf8mb4');

        $query_buffer = '';
        $bytes_processed = 0;
        $queries_executed = 0;
        $batch_queries = array();
        $batch_size = 50;
        $chunk_size = 1024 * 1024;
        $last_progress_update = 0;

        try {
            while (!feof($handle)) {
                $chunk = fread($handle, $chunk_size);
                if ($chunk === false) {
                    break;
                }

                $bytes_processed += strlen($chunk);
                $lines = explode("\n", $chunk);

                if (!empty($query_buffer)) {
                    $lines[0] = $query_buffer . $lines[0];
                    $query_buffer = '';
                }

                if (!empty($lines) && substr($chunk, -1) !== "\n") {
                    $query_buffer = array_pop($lines);
                }

                foreach ($lines as $line) {
                    $trimmed = trim($line);

                    if (empty($trimmed) || strpos($trimmed, '--') === 0 || strpos($trimmed, '/*') === 0) {
                        continue;
                    }

                    $query_buffer .= ' ' . $trimmed;

                    if (substr($trimmed, -1) === ';') {
                        $query = trim($query_buffer);

                        if (!empty($query)) {
                            if (stripos($query, 'SET ') === 0) {
                                $wpdb->query($query);
                            } else {
                                $batch_queries[] = $query;

                                if (count($batch_queries) >= $batch_size) {
                                    $result = self::execute_query_batch($batch_queries);
                                    if (is_wp_error($result)) {
                                        fclose($handle);
                                        $wpdb->query('SET FOREIGN_KEY_CHECKS=1');
                                        $wpdb->query('SET UNIQUE_CHECKS=1');
                                        $wpdb->query('COMMIT');
                                        return $result;
                                    }

                                    $queries_executed += count($batch_queries);
                                    $batch_queries = array();

                                    if ($queries_executed % 1000 === 0) {
                                        $wpdb->query('COMMIT');
                                        $wpdb->query('START TRANSACTION');
                                    }
                                }
                            }
                        }

                        $query_buffer = '';
                    }
                }

                $progress_percent = $file_size > 0 ? round(($bytes_processed / $file_size) * 100) : 0;
                if ($progress_callback && $progress_percent >= $last_progress_update + 5) {
                    call_user_func($progress_callback, sprintf(
                        'Importing database... %d%% (%s queries)',
                        $progress_percent,
                        number_format($queries_executed)
                    ), $progress_percent);
                    $last_progress_update = $progress_percent;
                }
            }

            if (!empty($batch_queries)) {
                $result = self::execute_query_batch($batch_queries);
                if (is_wp_error($result)) {
                    fclose($handle);
                    $wpdb->query('SET FOREIGN_KEY_CHECKS=1');
                    $wpdb->query('SET UNIQUE_CHECKS=1');
                    $wpdb->query('COMMIT');
                    return $result;
                }
                $queries_executed += count($batch_queries);
            }

            $wpdb->query('COMMIT');
            $wpdb->query('SET FOREIGN_KEY_CHECKS=1');
            $wpdb->query('SET UNIQUE_CHECKS=1');
            $wpdb->query('SET AUTOCOMMIT=1');

            fclose($handle);

            if ($progress_callback) {
                call_user_func($progress_callback, 'Database import complete', 100);
            }

            return true;

        } catch (Exception $e) {
            fclose($handle);
            $wpdb->query('ROLLBACK');
            $wpdb->query('SET FOREIGN_KEY_CHECKS=1');
            $wpdb->query('SET UNIQUE_CHECKS=1');
            $wpdb->query('SET AUTOCOMMIT=1');

            return new WP_Error('import_exception', $e->getMessage());
        }
    }

    private static function execute_query_batch($queries) {
        global $wpdb;

        $errors_count = 0;
        $max_errors = 10;

        foreach ($queries as $query) {
            $wpdb->suppress_errors(true);
            $result = $wpdb->query($query);
            $wpdb->suppress_errors(false);

            if ($result === false && !empty($wpdb->last_error)) {
                $error = $wpdb->last_error;
                $skip_error = false;

                if (stripos($error, "doesn't exist") !== false && stripos($query, 'SHOW') === 0) {
                    $skip_error = true;
                }

                if (stripos($error, 'Duplicate entry') !== false) {
                    $skip_error = true;
                }

                if (stripos($error, 'already exists') !== false) {
                    $skip_error = true;
                }

                if (!$skip_error) {
                    $errors_count++;

                    if ($errors_count > $max_errors) {
                        return new WP_Error(
                            'query_failed',
                            sprintf(
                                __('Database import failed after %d errors. Last error: %s', 'urumi-wp-cloner'),
                                $errors_count,
                                $error
                            )
                        );
                    }
                }
            }
        }

        return true;
    }

    private static function get_primary_key($table_name) {
        global $wpdb;

        $columns = $wpdb->get_results("SHOW COLUMNS FROM `{$table_name}`", ARRAY_A);

        foreach ($columns as $column) {
            if (isset($column['Key']) && $column['Key'] === 'PRI') {
                return $column['Field'];
            }
        }

        return null;
    }

    public static function get_database_size() {
        global $wpdb;

        $result = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT SUM(data_length + index_length)
                 FROM information_schema.TABLES
                 WHERE table_schema = %s",
                DB_NAME
            )
        );

        return intval($result);
    }

    /**
     * Search and replace in database
     */
    public static function search_replace($search, $replace) {
        global $wpdb;

        if (empty($search) || $search === $replace) {
            return true;
        }

        $tables = $wpdb->get_results('SHOW TABLES', ARRAY_N);

        foreach ($tables as $table) {
            $table_name = $table[0];
            $columns = $wpdb->get_results("SHOW COLUMNS FROM `{$table_name}`", ARRAY_A);

            foreach ($columns as $column) {
                $column_name = $column['Field'];
                $column_type = $column['Type'];

                if (!self::is_text_column($column_type)) {
                    continue;
                }

                $wpdb->query(
                    $wpdb->prepare(
                        "UPDATE `{$table_name}` SET `{$column_name}` = REPLACE(`{$column_name}`, %s, %s)",
                        $search,
                        $replace
                    )
                );
            }
        }

        return true;
    }

    private static function is_text_column($type) {
        $text_types = array('char', 'varchar', 'text', 'tinytext', 'mediumtext', 'longtext');

        foreach ($text_types as $text_type) {
            if (stripos($type, $text_type) !== false) {
                return true;
            }
        }

        return false;
    }

}
