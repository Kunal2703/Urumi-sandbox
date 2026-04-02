<?php
/**
 * SSR Template - Environment Variable
 *
 * Server-side rendered output for /var1, /var2, /var3 routes.
 *
 * @package React_WooCommerce_Headless
 * @author Urumi.ai
 */

$var_name  = $this->get_route_data( 'name' );
$var_value = defined( $var_name ) ? constant( $var_name ) : null;
?>
<div class="ssr-section">
    <h1><?php echo esc_html( $var_name ); ?></h1>
    <p><strong>Value:</strong> <?php echo $var_value !== null ? esc_html( $var_value ) : '<em>Not set</em>'; ?></p>
</div>
