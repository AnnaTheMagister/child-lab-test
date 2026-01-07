<?php
if (isset($_SESSION['team_member'])) {
    $member = $_SESSION['team_member'];
    $photo = get_field('photo', $member);
    $name = get_field('first_name', $member) . ' ' . get_field('last_name', $member);
    $bio = get_field('bio', $member);
    ?>


    <a href="?article_author=<?php echo $member->term_id; ?>" class="childlab-widget childlab-card-link author-card">
        <div class="square-container">
            <img src="<?php echo $photo; ?>" alt="<?php echo $name; ?>" class="childlab-image square-content" />
        </div>
        <div class="author-card__info">
            <h2><?php echo $name; ?></h2>
            <h3 class="author-card__bio"><?php echo $bio; ?></h3>
        </div>
    </a>

    <?php
}
?>