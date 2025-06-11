# 🌌 Traveller Sector to Fantasy Grounds Module Generator

A web-based tool to fetch data from [TravellerMap](https://travellermap.com/), format it, and output a `.mod` file compatible with Fantasy Grounds. Built using Astro, Vite, and Node.js tooling.

---

## 🚀 Features

- Fetches sector data from the TravellerMap API
- Supports multiple output formats:
  - **Module** (`.mod` ZIP file for Fantasy Grounds)
  - **System** (plain `.txt` file)
- CLI-style progress messages in the browser
- Clean, modern frontend powered by Astro + Vite

---

## 📦 Installation

### Prerequisites

- Node.js (v18 or newer recommended)
- `pnpm`, `npm`, or `yarn`
- Internet connection (for accessing TravellerMap data)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/fg-traveller-sector-generator.git
cd fg-traveller-sector-generator
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
```

### 3. Start the development server

```bash
pnpm dev
# or
npm run dev
```

The app will be available at [http://localhost:4321](http://localhost:4321)

---

## 🧭 Usage

1. Open the web interface in your browser.
2. Enter the name of the sector (e.g. `Spinward Marches`).
3. Choose your desired output format:
   - `module` for `.mod` file
   - `system` for plain `.txt` export
4. Click **Generate**.
5. The tool will:
   - Fetch all 16 subsectors
   - Parse and format the systems
   - Output your file in the `output/` folder

You’ll see build progress in real time, including messages like:

```
📦 Fetching subsector: Regina (A)
📄 43 systems in Regina
🧰 Formatting 439 total systems
✅ Build complete: Spinward Marches (module)
```

---

## 📁 Output

All files are saved to the local `output/` folder:

- `Spinward Marches Worlds.xml` — primary data file
- `definition.xml` — module metadata
- `Spinward Marches Worlds Module.mod` — zipped `.mod` archive for use in Fantasy Grounds

---

## 🛠️ Development Notes

- This project uses dynamic API calls to `https://travellermap.com/data/{sector}/{subsector}/sec`
- Uses `archiver` to create `.mod` files — install it with:

```bash
pnpm add archiver
```

- The web frontend calls an internal API at `/api/generate-stream` which invokes the `buildSector()` function in Node.

---

## 🧙 Fantasy Grounds Instructions

1. Copy the generated `.mod` file into your Fantasy Grounds `modules/` folder.
2. Launch Fantasy Grounds and load the module in your campaign.
3. Your sector should now be available for use!

---

## 📜 License

MIT License © Colin 'MadBeardMan' Richardson

---

## 🌍 Acknowledgements

- [TravellerMap API](https://travellermap.com/api)
- Mongoose Publishing — _Traveller 2e_
- SmiteWorks — _Fantasy Grounds_
