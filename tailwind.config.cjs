/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    fontSize: {
      sm: ["12.5px", { lineHeight: "125%", letterSpacing: "-0.375px" }],
      base: ["15px", "125%"],
      lg: ["18px", "125%"],
      xl: [
        "21.6px",
        {
          lineHeight: "110%",
          letterSpacing: "-0.648px",
          fontWeight: "600",
        },
      ],
      "2xl": [
        "25.92px",
        {
          lineHeight: "110%",
          letterSpacing: "-0.778px",
          fontWeight: "700",
        },
      ],
      "3xl": [
        "31.104px",
        {
          lineHeight: "110%",
          letterSpacing: "-0.933px;",
          fontWeight: "700",
        },
      ],
    },
    colors: {
      transparent: "transparent",
      white: "#fff",
      black: "#000",
      action: {
        red: "#E3170A",
        green: "#A9E5BB",
        yellow: "#FCF6B1",
        orange: "#F7B32B",
      },
      accent: {
        900: "#2D1E2F",
        800: "#3D293F",
        700: "#523756",
        600: "#6F4A74",
        500: "#95649C",
      },
      primary: {
        900: "#393E46",
        500: "#929AAB",
        200: "#EEE",
        100: "#F7F7F7",
      },
    },
    spacing: {
      0: "0",
      1: "3px",
      2: "5px",
      3: "10px",
      4: "15px",
      5: "20px",
      6: "25px",
      7: "40px",
      8: "50px",
      9: "60px",
      10: "75px",
      11: "400px",
    },

    maxWidth: {
      md: "84px",
      xl: "400px",
    },
    borderRadius: {
      sm: "5px",
      DEFAULT: "10px",
    },
    backdropBlur: {
      DEFAULT: "10px",
    },

    extend: {
      height: {
        1: "15px",
        2: "30px",
        3: "60px",
        4: "200px",
      },
      width: {
        1: "150px",
        2: "335px",
      },
    },
  },

  plugins: [],
};

module.exports = config;
