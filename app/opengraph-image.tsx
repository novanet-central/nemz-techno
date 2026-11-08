import { ImageResponse } from "next/og";

export const alt = "Nemzeti Technokrata Műhely";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#f4f1ea",
          color: "#1b1b19",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "58px 70px",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 4,
          }}
        >
          <span style={{ color: "#941f2b" }}>NEMZETI</span>
          <span style={{ margin: "0 10px" }}>TECHNOKRATA</span>
          <span style={{ color: "#264b3c" }}>MŰHELY</span>
        </div>
        <div
          style={{
            borderTop: "3px solid #1b1b19",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            marginTop: 42,
          }}
        >
          <span style={{ fontSize: 70, fontWeight: 800, letterSpacing: -3 }}>
            MAGYAR ÉRDEK.
          </span>
          <span
            style={{
              color: "#941f2b",
              fontFamily: "serif",
              fontSize: 64,
              fontStyle: "italic",
              marginTop: 6,
            }}
          >
            Tárgyilagos elemzés.
          </span>
        </div>
        <div
          style={{
            borderTop: "1px solid #1b1b19",
            display: "flex",
            fontSize: 18,
            fontWeight: 700,
            justifyContent: "space-between",
            letterSpacing: 2,
            paddingTop: 20,
          }}
        >
          <span>GEOPOLITIKAI ÉS STRATÉGIAI ELEMZŐ MŰHELY</span>
          <span style={{ color: "#941f2b" }}>NEMZETITECHNOKRATA.HU</span>
        </div>
      </div>
    ),
    size,
  );
}
