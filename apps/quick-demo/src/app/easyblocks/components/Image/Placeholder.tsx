import React from "react";

function Placeholder() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#5B5B5B",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="300"
        height="287"
        viewBox="0 0 300 287"
        fill="none"
        style={{
          width: "50%",
          height: "50%",
          display: "block",
          color: "#747474",
          opacity: 0.5,
        }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M34.6154 0.785721H265.385C284.502 0.785721 300 15.5307 300 33.7198V253.28C300 271.469 284.502 286.214 265.385 286.214H34.6154C15.4978 286.214 0 271.469 0 253.28V33.7198C0 15.5307 15.4978 0.785721 34.6154 0.785721ZM34.6154 22.7418C28.2429 22.7418 23.0769 27.6568 23.0769 33.7198V162.461L61.8877 125.536C63.879 123.641 66.5935 122.597 69.4094 122.643C72.225 122.689 74.9003 123.821 76.8219 125.78L158.62 209.151L223.426 147.492C227.481 143.633 234.058 143.633 238.112 147.492L276.923 184.417V33.7198C276.923 27.6568 271.756 22.7418 265.385 22.7418H34.6154ZM23.0769 253.28V190.407L68.9739 146.739L150.718 230.053L183.257 264.258H34.6154C28.2429 264.258 23.0769 259.342 23.0769 253.28ZM265.385 264.258H211.269L172.693 223.705L230.769 168.451L276.923 212.363V253.28C276.923 259.342 271.756 264.258 265.385 264.258ZM130.367 99.5879C130.367 89.2714 139.157 80.9081 150 80.9081C160.843 80.9081 169.633 89.2714 169.633 99.5879C169.633 109.904 160.843 118.268 150 118.268C139.157 118.268 130.367 109.904 130.367 99.5879ZM150 61.1477C127.686 61.1477 109.597 78.358 109.597 99.5879C109.597 120.818 127.686 138.028 150 138.028C172.314 138.028 190.403 120.818 190.403 99.5879C190.403 78.358 172.314 61.1477 150 61.1477Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export { Placeholder };