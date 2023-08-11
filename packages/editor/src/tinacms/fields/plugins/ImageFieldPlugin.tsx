import { Media, MediaStore } from "@easyblocks/app-utils";
import React, { useEffect, useState } from "react";
import { useCMS } from "../../react-core";
import { ImageUpload, InputProps } from "../components";
import { parse } from "./textFormat";
import { wrapFieldsWithMeta } from "./wrapFieldWithMeta";

interface ImageProps {
  path: string;
  previewSrc?: MediaStore["previewSrc"];
  uploadDir?(formValues: any): string;
  clearable?: boolean;
}

export function usePreviewSrc(
  value: string,
  fieldName: string,
  formValues: any,
  getPreviewSrc?: MediaStore["previewSrc"]
): [string, boolean] {
  const cms = useCMS();
  const getSrc = getPreviewSrc || cms.media.previewSrc;
  const [{ src, loading }, setState] = useState({
    src: "",
    loading: true,
  });

  useEffect(() => {
    let componentUnmounted = false;
    let tmpSrc = "";
    (async () => {
      try {
        tmpSrc = await getSrc(value, fieldName, formValues);
        // eslint-disable-next-line no-empty
      } catch {}

      if (componentUnmounted) return;

      setState({
        src: tmpSrc,
        loading: false,
      });
    })();

    return () => {
      componentUnmounted = true;
    };
  }, [value]);

  return [src, loading];
}

export const ImageField = wrapFieldsWithMeta<InputProps, ImageProps>(
  (props) => {
    const cms = useCMS();
    const { form, field } = props;
    const { name, value } = props.input;
    const [src, srcIsLoading] = usePreviewSrc(
      value,
      name,
      form.getState().values,
      field.previewSrc
    );

    let onClear: any;
    if (props.field.clearable) {
      onClear = () => props.input.onChange("");
    }

    function onChange(media?: Media) {
      if (media) {
        props.input.onChange("");
        props.input.onChange(media);
      }
    }

    const uploadDir = props.field.uploadDir || (() => "");

    return (
      <ImageUpload
        value={value}
        previewSrc={src}
        loading={srcIsLoading}
        onClick={() => {
          const directory = uploadDir(props.form.getState().values);
          cms.media.open({
            allowDelete: true,
            directory,
            onSelect: onChange,
          });
        }}
        onDrop={async ([file]: File[]) => {
          const directory = uploadDir(props.form.getState().values);

          const [media] = await cms.media.persist([
            {
              directory,
              file,
            },
          ]);

          onChange(media);
        }}
        onClear={onClear}
      />
    );
  }
);

export const ImageFieldPlugin = {
  name: "image",
  Component: ImageField,
  parse,
};
