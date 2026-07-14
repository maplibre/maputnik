import React, { type DragEvent, type FormEvent, useRef, useState } from "react";
import { MdFileUpload } from "react-icons/md";
import { MdAddCircleOutline } from "react-icons/md";
import { Trans, type WithTranslation, withTranslation } from "react-i18next";

import { ModalLoading } from "./ModalLoading";
import { Modal } from "./Modal";
import { InputButton } from "../InputButton";
import { InputUrl } from "../InputUrl";

import { ensureStyleValidity } from "../../libs/style";
import publicStyles from "../../config/styles.json";

type PublicStyleProps = {
  url: string
  thumbnailUrl: string
  title: string
  onSelect(...args: unknown[]): unknown
};

const PublicStyle: React.FC<PublicStyleProps> = (props) => {
  return <div className="maputnik-public-style">
    <InputButton
      className="maputnik-public-style-button"
      aria-label={props.title}
      onClick={() => props.onSelect(props.url)}
    >
      <div className="maputnik-public-style-header">
        <div>{props.title}</div>
        <span className="maputnik-space" />
        <MdAddCircleOutline />
      </div>
      <div
        className="maputnik-public-style-thumbnail"
        style={{
          backgroundImage: `url(${props.thumbnailUrl})`
        }}
      ></div>
    </InputButton>
  </div>;
};

type ModalOpenInternalProps = {
  isOpen: boolean
  onOpenToggle(): void
  onStyleOpen(...args: unknown[]): unknown
  fileHandle: FileSystemFileHandle | null
} & WithTranslation;

const ModalOpenInternal: React.FC<ModalOpenInternalProps> = (props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [styleUrl, setStyleUrl] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [error, setError] = useState<string | null | undefined>(undefined);
  const [activeRequest, setActiveRequest] = useState<any>(undefined);
  const [activeRequestUrl, setActiveRequestUrl] = useState<string | null | undefined>(undefined);

  const clearError = () => {
    setError(null);
  };

  const onCancelActiveRequest = (e: Event) => {
    // Else the click propagates to the underlying modal
    if (e) e.stopPropagation();

    if (activeRequest) {
      activeRequest.abort();
      setActiveRequest(null);
      setActiveRequestUrl(null);
    }
  };

  const onStyleSelect = (styleUrl: string) => {
    clearError();

    let canceled: boolean = false;

    fetch(styleUrl, {
      mode: "cors",
      credentials: "same-origin"
    })
      .then(function (response) {
        return response.json();
      })
      .then((body) => {
        if (canceled) {
          return;
        }

        setActiveRequest(null);
        setActiveRequestUrl(null);

        const mapStyle = ensureStyleValidity(body);
        console.log("Loaded style ", mapStyle.id);
        props.onStyleOpen(mapStyle);
        onOpenToggle();
      })
      .catch((err) => {
        setError(`Failed to load: '${styleUrl}'`);
        setActiveRequest(null);
        setActiveRequestUrl(null);
        console.error(err);
        console.warn("Could not open the style URL", styleUrl);
      });

    setActiveRequest({
      abort: function () {
        canceled = true;
      }
    });
    setActiveRequestUrl(styleUrl);
  };

  const onSubmitUrl = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onStyleSelect(styleUrl);
  };

  const onOpenFile = async () => {
    clearError();

    const pickerOpts: OpenFilePickerOptions = {
      types: [
        {
          description: "json",
          accept: { "application/json": [".json"] },
        },
      ],
      multiple: false,
    };

    const [fileHandle] = await window.showOpenFilePicker(pickerOpts) as Array<FileSystemFileHandle>;
    const file = await fileHandle.getFile();
    const content = await file.text();

    let mapStyle;
    try {
      mapStyle = JSON.parse(content);
    } catch (err) {
      setError((err as Error).toString());
      return;
    }
    mapStyle = ensureStyleValidity(mapStyle);

    props.onStyleOpen(mapStyle, fileHandle);
    onOpenToggle();
    return file;
  };

  // it is not guaranteed that the File System Access API is available on all
  // browsers. If the function is not available, a fallback behavior is used.
  const onFileChanged = (files: FileList | null) => {
    if (!files) return;
    if (files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    clearError();

    reader.readAsText(file, "UTF-8");
    reader.onload = e => {
      let mapStyle;
      try {
        mapStyle = JSON.parse(e.target?.result as string);
      }
      catch (err) {
        setError((err as Error).toString());
        return;
      }
      mapStyle = ensureStyleValidity(mapStyle);
      props.onStyleOpen(mapStyle);
      onOpenToggle();
    };
    reader.onerror = e => console.log(e.target);
  };

  const onOpenToggle = () => {
    setStyleUrl("");
    setIsDragOver(false);
    clearError();
    props.onOpenToggle();
  };

  const onBrowseClick = async () => {
    if (typeof window.showOpenFilePicker === "function") {
      await onOpenFile();
      return;
    }

    fileInputRef.current?.click();
  };

  const onFileDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const onFileDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const onFileDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragOver(false);
    onFileChanged(e.dataTransfer.files);
  };

  const onChangeUrl = (url: string) => {
    setStyleUrl(url);
  };

  const t = props.t;
  const styleOptions = publicStyles.map(style => {
    return <PublicStyle
      key={style.id}
      url={style.url}
      title={style.title}
      thumbnailUrl={style.thumbnail}
      onSelect={onStyleSelect}
    />;
  });

  let errorElement;
  if (error) {
    errorElement = (
      <div className="maputnik-modal-error">
        {error}
        <a href="#" onClick={() => clearError()} className="maputnik-modal-error-close">×</a>
      </div>
    );
  }

  return (
    <div>
      <Modal
        data-wd-key="modal:open"
        isOpen={props.isOpen}
        onOpenToggle={() => onOpenToggle()}
        title={t("Open Style")}
      >
        {errorElement}
        <section className="maputnik-modal-section">
          <h1>{t("Open local Style")}</h1>
          <p>{t("Open a local JSON style from your computer.")}</p>
          <div
            data-wd-key="modal:open.dropzone"
            className={`maputnik-upload-dropzone${isDragOver ? " maputnik-upload-dropzone--active" : ""}`}
            role="button"
            tabIndex={0}
            onDragOver={onFileDragOver}
            onDragLeave={onFileDragLeave}
            onDrop={onFileDrop}
            onClick={() => void onBrowseClick()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                void onBrowseClick();
              }
            }}
          >
            <div className="maputnik-upload-dropzone-content">
              <MdFileUpload className="maputnik-upload-dropzone-icon" aria-hidden="true" />
              <p className="maputnik-upload-dropzone-text">
                {t("Drag and drop a style JSON file here or click to browse")}
              </p>
            </div>
            <input
              ref={fileInputRef}
              data-wd-key="modal:open.file.input"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => onFileChanged(e.target.files)}
            />
          </div>
        </section>

        <section className="maputnik-modal-section">
          <form onSubmit={onSubmitUrl}>
            <h1>{t("Load from URL")}</h1>
            <p>
              <Trans t={t}>
                Load from a URL. Note that the URL must have <a href="https://enable-cors.org" target="_blank" rel="noopener noreferrer">CORS enabled</a>.
              </Trans>
            </p>
            <InputUrl
              aria-label={t("Style URL")}
              data-wd-key="modal:open.url.input"
              type="text"
              className="maputnik-input"
              default={t("Enter URL...")}
              value={styleUrl}
              onInput={onChangeUrl}
              onChange={onChangeUrl}
            />
            <div>
              <InputButton
                data-wd-key="modal:open.url.button"
                type="submit"
                className="maputnik-big-button"
                disabled={styleUrl.length < 1}
              >Load from URL</InputButton>
            </div>
          </form>
        </section>

        <section className="maputnik-modal-section maputnik-modal-section--shrink">
          <h1>{t("Gallery Styles")}</h1>
          <p>
            {t("Open one of the publicly available styles to start from.")}
          </p>
          <div className="maputnik-style-gallery-container">
            {styleOptions}
          </div>
        </section>
      </Modal>

      <ModalLoading
        isOpen={!!activeRequest}
        title={t("Loading style")}
        onCancel={(e: Event) => onCancelActiveRequest(e)}
        message={t("Loading") + ": " + activeRequestUrl}
      />
    </div>
  );
};

export const ModalOpen = withTranslation()(ModalOpenInternal);
