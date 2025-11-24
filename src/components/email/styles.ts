export const paragraph: React.CSSProperties = {
  color: "#71717a",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

export const heading: React.CSSProperties = {
  color: "#18181bbb",
  fontSize: "18px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

export const main: React.CSSProperties = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

export const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

export const box: React.CSSProperties = {
  padding: "0 48px",
};

export const hr: React.CSSProperties = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

export const anchor: React.CSSProperties = {
  color: "#3b82f6",
  // @ts-expect-error typescript says this does not exist in React.CSSProperties, which may be correct, but it is a valid property so typescript shut the fuck up
  "text-decoration-line": "underline",
};

export const footer: React.CSSProperties = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};

export const button: React.CSSProperties = {
  backgroundColor: "#18181b",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "semibold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "10px",
  cursor: "pointer",
};
