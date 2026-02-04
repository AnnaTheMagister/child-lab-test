export const BASE_URL =
  window.location.host === "localhost"
    ? "http://localhost/childlab.local"
    : window.location.origin;
export const MEDIA_URL = BASE_URL + "/wp-json/wp/v2/media/";

export const DEFAULT_IMAGE_URL = themeData.templateUrl + "/assets/images/post-bg.jpg";
