import { themeVars } from "@/theme/theme.css";
import { rgbAlpha } from "@/utils/theme";
import styled from "styled-components";

const StyledEditor = styled.div`
  /* 标题样式 */
  h1 {
    font-size: 64px;
    line-height: 1.25;
    font-weight: 800;
  }
  h2 {
    font-size: 56px;
    line-height: 1.25;
    font-weight: 800;
  }
  h3 {
    font-size: 48px;
    line-height: 1.25;
    font-weight: 700;
  }
  h4 {
    font-size: 40px;
    line-height: 1.25;
    font-weight: 700;
  }
  h5 {
    font-size: 32px;
    line-height: 1.25;
    font-weight: 700;
  }
  h6 {
    font-size: 24px;
    line-height: 1.25;
    font-weight: 600;
  }

  /* 图片 */
  img {
    display: inline;
    max-width: 100%;
    height: auto;
  }

  /* 容器 */
  overflow: hidden;
  position: relative;
  border-radius: 8px;
  border: 1px solid rgba(145, 158, 171, 0.2);

  /* Quill 容器 */
  & .ql-container.ql-snow {
    border: none;
    line-height: 1.6;
    font-weight: 400;
    font-size: 0.875rem; /* 14px */
  }

  /* 编辑器内容 */
  & .ql-editor {
    min-height: 160px;
    max-height: 640px;
    background-color: rgba(145, 158, 171, 0.08);

    &.ql-blank::before {
      font-style: normal;
      color: #6e6e6e; /* secondary 文本色 */
    }

    & pre.ql-syntax {
      border-radius: 8px;
      line-height: 1.57;
      font-size: 0.875rem; /* 14px */
      font-family: "Public Sans", sans-serif;
      font-weight: 400;
      padding: 16px;
      background-color: #f4f4f4; /* neutral 背景 */
    }
    & ol li:before {
      content: '\\2022';   
    }  
  }
`;

const StyledToolbar = styled.div`
  & .ql-snow.ql-toolbar button:hover .ql-fill,
  .ql-snow .ql-toolbar button:hover .ql-fill,
  .ql-snow.ql-toolbar button:focus .ql-fill,
  .ql-snow .ql-toolbar button:focus .ql-fill,
  .ql-snow.ql-toolbar button.ql-active .ql-fill,
  .ql-snow .ql-toolbar button.ql-active .ql-fill,
  .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,
  .ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill,
  .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill,
  .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill,
  .ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill,
  .ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill,
  .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill,
  .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill,
  .ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill,
  .ql-snow .ql-toolbar button:hover .ql-stroke.ql-fill,
  .ql-snow.ql-toolbar button:focus .ql-stroke.ql-fill,
  .ql-snow .ql-toolbar button:focus .ql-stroke.ql-fill,
  .ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill,
  .ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill,
  .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
  .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
  .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
  .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
  .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
  .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
  .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill,
  .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {
    fill: ${themeVars.colors.palette.primary.default};
  }
  & .ql-snow.ql-toolbar button:hover,
  .ql-snow .ql-toolbar button:hover,
  .ql-snow.ql-toolbar button:focus,
  .ql-snow .ql-toolbar button:focus,
  .ql-snow.ql-toolbar button.ql-active,
  .ql-snow .ql-toolbar button.ql-active,
  .ql-snow.ql-toolbar .ql-picker-label:hover,
  .ql-snow .ql-toolbar .ql-picker-label:hover,
  .ql-snow.ql-toolbar .ql-picker-label.ql-active,
  .ql-snow .ql-toolbar .ql-picker-label.ql-active,
  .ql-snow.ql-toolbar .ql-picker-item:hover,
  .ql-snow .ql-toolbar .ql-picker-item:hover,
  .ql-snow.ql-toolbar .ql-picker-item.ql-selected,
  .ql-snow .ql-toolbar .ql-picker-item.ql-selected {
    color: ${themeVars.colors.palette.primary.default};
  }

  & .ql-snow.ql-toolbar button:hover .ql-stroke,
  .ql-snow .ql-toolbar button:hover .ql-stroke,
  .ql-snow.ql-toolbar button:focus .ql-stroke,
  .ql-snow .ql-toolbar button:focus .ql-stroke,
  .ql-snow.ql-toolbar button.ql-active .ql-stroke,
  .ql-snow .ql-toolbar button.ql-active .ql-stroke,
  .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
  .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke,
  .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
  .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke,
  .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke,
  .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke,
  .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
  .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
  .ql-snow.ql-toolbar button:hover .ql-stroke-miter,
  .ql-snow .ql-toolbar button:hover .ql-stroke-miter,
  .ql-snow.ql-toolbar button:focus .ql-stroke-miter,
  .ql-snow .ql-toolbar button:focus .ql-stroke-miter,
  .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter,
  .ql-snow .ql-toolbar button.ql-active .ql-stroke-miter,
  .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
  .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
  .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
  .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
  .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
  .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
  .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter,
  .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
    stroke: ${themeVars.colors.palette.primary.default};
  }

  & .ql-stroke {
    stroke: ${themeVars.colors.text.primary};
  }
  & .ql-fill,
  .ql-stroke.ql-fill {
    fill: ${themeVars.colors.text.primary};
  }

  & .ql-toolbar.ql-snow {
    border: none;
    border-bottom: 1px solid ${rgbAlpha(themeVars.colors.palette.gray[200], 0.2)};
    // Button
    & button {
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
    }
    & button svg,
    span svg {
      width: 20px;
      height: 20px;
    }
    & .ql-picker-label {
      border-radius: 4px;
      border-color: transparent !important;
      background-color: ${themeVars.colors.background.paper};
      color: ${themeVars.colors.text.primary};
    }
    & .ql-picker-options {
      margin-top: 4px;
      border: none;
      max-height: 200px;
      overflow: auto;
      border-radius: 8px;
      color: ${themeVars.colors.text.primary};
      background-color: ${themeVars.colors.background.paper};
    }
  }
`;
export { StyledEditor, StyledToolbar };
