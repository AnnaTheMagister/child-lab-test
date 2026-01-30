import React, { useState, useEffect, FC, useMemo } from "react";
import Loader from "../Loader/Loader";
import { MethodologyTag } from "../../entities/MethodologyTags";
import { distributeTags } from "./distributeTags";
const BASE_URL = window.location.host === 'localhost' ? 'http://localhost/childlab.local' : window.location.origin
const DEFAULT_TAG = {
  id: -1,
  name: window.wp.i18n.__("Все", "childlab"),
  acf: {
    color: "rgba(138, 214, 80, 1)",
  },
};

const getScreenSize = (size: number) => {
  if (size > 1200) {
    return "xlg";
  }
  if (size <= 1200 && size > 992) {
    return "lg";
  }
  if (size <= 992 && size > 768) {
    return "md";
  }
  if (size <= 768 && size > 576) {
    return "sm";
  }
  return "xs";
};

const getMaxTagsInRow = (size: string) =>
  (size === "lg" || size == "xlg") ? 6 : (size === "md" || size === "sm") ? 3 : 2;

export const FrontListComponent = () => {
  const [tagsData, setTagsData] = useState<MethodologyTag[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [maxTagsInRow, setMaxTagsInRow] = useState(
    getMaxTagsInRow(getScreenSize(window.innerWidth)),
  );

  useEffect(() => {
    window.addEventListener("resize", () => {
      setMaxTagsInRow(getMaxTagsInRow(getScreenSize(window.innerWidth)));
    });
  }, []);

  useEffect(() => {
    fetch(BASE_URL + "/wp-json/wp/v2/methodology-tags?per_page=100")
      .then((response) => response.json())
      .then((data: MethodologyTag[]) => {
        setTagsData([
          DEFAULT_TAG,
          ...data
            .filter((t) => t.acf.order > 0)
            .sort((t1, t2) => t1.acf.order - t2.acf.order),
        ]);
        setTagsLoading(false);
      });
  }, []);

  const distributedTags = useMemo(() => {
    if (!tagsData.length) {
      return [];
    }

    const distribution = distributeTags(tagsData.length, maxTagsInRow);
    let currentRow = 0;
    let acc = 0;
    return tagsData.map((tag, id) => {
      if (id >= acc + distribution[currentRow]) {
        acc += distribution[currentRow];
        currentRow++;
      }
      return { ...tag, width: distribution[currentRow] };
    });
  }, [tagsData, maxTagsInRow]);

  return (
    <div className="container">
      <div className="methodology-tags-menu">
        {tagsLoading && <Loader fullScreen={false} />}
        {distributedTags.map((tag) => {
          return <MethodologyTagComponent key={tag.id} {...tag} />;
        })}
      </div>
    </div>
  );
};

const DEFAULT_SVG_PATTERN =
  BASE_URL + "/wp-content/themes/child-lab-test/assets/images/svg-patterns/all.svg";

const MethodologyTagComponent: FC<MethodologyTag & { width: number }> = (
  tag,
) => {
  const backgroundColor = tag.acf.color ?? "#f00";
  const svg_pattern = tag.acf.svg_pattern
    ? tag.acf.svg_pattern
    : DEFAULT_SVG_PATTERN;
  return (
    <a
      href={`?methodology=${tag.id}`}
      className={`childlab-widget childlab-card-link methodology-tags-menu__tag methodology-tag-width-${
        tag.width ?? 4
      }`}
      style={{ backgroundColor }}
    >
      <div
        className="methodology-tags-menu__svg-background"
        ref={(ref) => {
          createSVGPattern(ref, svg_pattern, {
            count: 10,
            minScale: 0.6,
            maxScale: 0.4,
            minRotate: -180,
            maxRotate: 180,
            spacing: 5,
            opacity: 0.5,
          });
        }}
      />
      <span title={tag.name} class="truncate">
        {tag.name}
      </span>
    </a>
  );
};
