<?php
if (isset($_SESSION['team_member'])) {
    $member = $_SESSION['team_member'];
    $photo = get_article_author_image($member);
    $name = get_article_author_name($member);
    $bio = get_field('bio', $member);
    ?>


    <a href="<?php echo get_site_url(); ?>/article_author/<?php echo $member->slug; ?>" class="childlab-widget childlab-card-link author-card">
        <div class="square-container">
            <img src="<?php echo $photo; ?>" alt="<?php echo $name; ?>" class="childlab-image square-content" />
        </div>
        <div class="author-card__info">
            <h2 class="author-card__name"><?php echo $name; ?></h2>
            <h3 class="author-card__bio"><?php echo $bio; ?></h3>
        </div>
    </a>

    <?php
}
?>