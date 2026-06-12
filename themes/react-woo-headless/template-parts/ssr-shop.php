<?php
/**
 * SSR Template - Shop / Product Listing (/shop)
 *
 * Full semantic HTML for bots, crawlers, and AI answer engines (AEO).
 * Renders product catalog with names, prices, and descriptions.
 *
 * @package React_WooCommerce_Headless
 * @author Urumi.ai
 */

$products = React_SSR_Data::get_products(array('posts_per_page' => 12));
$currency = function_exists('get_woocommerce_currency_symbol') ? get_woocommerce_currency_symbol() : '$';
?>

<div class="ssr-section">
    <h1>Shop — Urumi Products</h1>
    <p>Browse our collection of products.</p>
</div>

<?php if (!empty($products)): ?>
    <?php foreach ($products as $product):
        $data = React_SSR_Data::format_product_data($product);
        if (!$data) continue;
    ?>
    <div class="ssr-section" itemscope itemtype="https://schema.org/Product">
        <h2><a href="<?php echo esc_url($data['permalink']); ?>" itemprop="name"><?php echo esc_html($data['name']); ?></a></h2>
        <?php if (!empty($data['image'])): ?>
        <img itemprop="image" src="<?php echo esc_url($data['image']); ?>" alt="<?php echo esc_attr($data['name']); ?>" style="max-width:300px;height:auto;">
        <?php endif; ?>
        <p itemprop="offers" itemscope itemtype="https://schema.org/Offer">
            <strong>Price: <span itemprop="price" content="<?php echo esc_attr($data['price']); ?>"><?php echo esc_html($currency . $data['price']); ?></span></strong>
            <meta itemprop="priceCurrency" content="<?php echo esc_attr(get_woocommerce_currency()); ?>">
        </p>
        <?php if (!empty($data['short_description'])): ?>
        <div itemprop="description"><?php echo wp_kses_post($data['short_description']); ?></div>
        <?php endif; ?>
    </div>
    <?php endforeach; ?>
<?php else: ?>
    <p>No products found.</p>
<?php endif; ?>
