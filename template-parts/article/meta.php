<?php
$authors = get_the_terms(get_the_ID(), 'article_author');
$published_date = get_the_date('d.m.Y');
?>

<div class="article-meta">

    <div class="article-meta childlab-text childlab-text__meta">
        <?php if ($authors): ?>
            <div class="article-meta__authors">
                <div class="childlab-avatars">
                    <?php foreach ($authors as $index => $author): ?>
                        <img src="<?php echo get_field('photo', $author); ?>" class="childlab-avatar" />
                    <?php endforeach; ?>
                </div>
                <div class="article-meta__authors-names">
                    <?php foreach ($authors as $index => $author) {
                        $first_name = get_field('first_name', $author);
                        echo (($index != 0 ? ', ' : '') . $first_name);
                    } ?>
                </div>
            </div>
        <?php endif; ?>
        · <?php echo $published_date ?>
    </div>

</div>