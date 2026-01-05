<?php
$authors = get_field('authors'); // Связь с team_member
$published_date = get_the_date('d.m.Y');
?>

<div class="article-meta">

    <div class="article-meta childlab-text childlab-text__meta">
        <?php if ($authors): ?>
            <div class="article-meta__authors">
                <div class="childlab-avatars">
                    <?php foreach ($authors as $index => $author): ?>
                        <img src="<?php echo get_avatar_url($author); ?>" class="childlab-avatar" />
                    <?php endforeach; ?>
                </div>
                <div class="article-meta__authors-names">
                    <?php foreach ($authors as $index => $author) {
                        echo (($index != 0 ? ', ' : '') . $author['display_name']);
                    } ?>
                </div>
            </div>
        <?php endif; ?>
        · <?php echo $published_date ?>
    </div>

</div>