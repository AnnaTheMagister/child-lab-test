import React, { useState, useEffect, FC, useMemo, useCallback } from "react";
import Loader from "../Loader/Loader";
import {
  MethodologyTag,
  useMethodologyTags,
} from "../../entities/MethodologyTags";
import { distributeTags } from "./distributeTags";
import { BASE_URL } from "../../shared/consts";
import { useCurrentSearch } from "../../shared/useCurrentSearch";

const DEFAULT_TAG = {
  id: -1,
  name: window.wp.i18n.__("Все", "childlab"),
  acf: {
    color: "rgba(138, 214, 80, 1)",
  },
};

export const getScreenSize = (size: number) => {
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
  size === "lg" || size == "xlg" ? 6 : size === "md" || size === "sm" ? 3 : 2;

export const FrontListComponent = () => {
  const { methodologyTags, tagsLoading } = useMethodologyTags();
  const [maxTagsInRow, setMaxTagsInRow] = useState(
    getMaxTagsInRow(getScreenSize(window.innerWidth)),
  );

  useEffect(() => {
    window.addEventListener("resize", () => {
      setMaxTagsInRow(getMaxTagsInRow(getScreenSize(window.innerWidth)));
    });
  }, []);

  const tagsData = useMemo(
    () =>
      methodologyTags.length
        ? [
          DEFAULT_TAG,
          ...methodologyTags
            .filter((t) => t.acf.order > 0)
            .sort((t1, t2) => t1.acf.order - t2.acf.order),
        ]
        : [],
    [methodologyTags],
  );

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

const DEFAULT_TAG_PATTERN = themeData.templateUrl +
  "/assets/images/all.png";



const MethodologyTagComponent: FC<MethodologyTag & { width: number }> = (
  tag,
) => {
  const { currentTaxonomy, currentTag } = useCurrentSearch();

  const backgroundColor = tag.acf.color ?? "#f00";

  const handleClick = (e) => {
    e.preventDefault();
    history.pushState({}, "", `?methodology=${tag.id}`);
    window.dispatchEvent(new Event("pushstate"));
  };

  return (
    <a
      href={`?methodology=${tag.id}`}
      onClick={handleClick}
      className={`childlab-card-link methodology-tags-menu__tag methodology-tag-width-${tag.width ?? 4
        } ${currentTag == tag.id || !currentTag && tag.id == -1 ? "methodology-tag__active" : ""
        }`}
      style={{ backgroundColor }}
    >
      <div
        className="methodology-tags-menu__svg-background"
        style={{ backgroundImage: `url(${tag.acf.tag_image || DEFAULT_TAG_PATTERN})`, backgroundColor }}
      />
      <div className="methodology-tags-menu__title">
        <span title={tag.name}>
          {tag.name}
        </span>
      </div>
    </a>
  );
};
