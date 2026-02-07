<?php get_template_part('template-parts/global/footer'); ?>

<?php wp_footer(); ?>
<!-- Yandex.Metrika counter -->

<script type="text/javascript">
    const metricsIds = {
        'https://childlab.co.uk': 106688300,
        'https://childlab.education': 106653817
    };
    const metricsId = metricsIds[window.origin];
    console.log('metrics', metricsId);
    (function (m, e, t, r, i, k, a) {
        m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
        m[i].l = 1 * new Date();
        for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
        k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=' + metricsId, 'ym');

    ym(metricsId, 'init', { ssr: true, webvisor: true, clickmap: true, ecommerce: "dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce: true, trackLinks: true });
    const div = document.createElement('div');
    const img = document.createElement('img');
    img.setAttribute('src', 'https://mc.yandex.ru/watch/' + metricsId);
    img.setAttribute('style', 'position:absolute; left:-9999px;')
    div.appendChild(img);
    document.body.appendChild(div);
</script>
<!-- /Yandex.Metrika counter -->
</body>

</html>