export default function DemoChild({ label, onPing }) {
  return (
    <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 10 }}>
      <p style={{ margin: 0, color: "#555" }}>자식 컴포넌트</p>
      <p style={{ margin: "8px 0 10px" }}>label: {label}</p>
      <button onClick={onPing}>자식 버튼(부모 함수 실행)</button>
    </div>
  );
}
