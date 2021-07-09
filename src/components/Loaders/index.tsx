import "./loaders.css";

export function LoaderDualRing({ color }: { color?: string }) {
  color = color || "#aaa";
  return (
    <div className="lds-dual-ring">
      <div
        style={{
          border: `2px solid ${color}`,
          borderColor: `${color} transparent ${color} transparent`,
        }}
      ></div>
    </div>
  );
}

export function LoaderRipple() {
  return (
    <div className="lds-ripple">
      <div></div>
      <div></div>
    </div>
  );
}
