import gulp from "gulp";
import fs from "fs";

/**
 * Automatically generates (or removes) a re-export line:
 * * export { default as THING } from "/path/to/THING.extension";
 * in the correct _exporter.js file when a THING is created (or deleted)
 */

const CWD = "src/lib/";
const paths = {
	COMPS: {
		glob: "components/**/*.svelte",
		exp: "components/_exporter.js",
	},
	SCRIPTS: {
		glob: ["scripts/**/*.js", "!scripts/**/_*.js"],
		exp: "scripts/_exporter.js",
	},
	STORES: {
		glob: ["stores/*.js", "!stores/_*.js"],
		exp: "stores/_exporter.js",
	},
};

function generateExportLine(path) {
	let name = path.split("/").pop(); // path/to/fileName.js -> fileName.js;
	name = name.substring(0, name.lastIndexOf(".")); // fileName.js -> fileName

	return `export { default as ${name} } from "${path}";`;
}

function processWatchedData(watched) {
	watched = Object.entries(watched).filter((el) =>
		el[1].some((eel) => /(\.js|\.svelte)$/.test(eel))
	);

	watched = watched.map((el) =>
		[el[0]].concat([el[1].filter((eel) => /(\.js|\.svelte)$/.test(eel))])
	);

	const data = [];
	watched.forEach(([key, value]) => {
		value.forEach((el) => {
			let path = (CWD + key).replaceAll("\\", "/") + "/" + el;
			data.push(generateExportLine(path));
		});
	});

	return data; //array of export lines
}

function touchFile(path, type, mode, createData) {
	path = (CWD + path).replaceAll("\\", "/");
	let content = fs.readFileSync(CWD + paths[type].exp, "utf-8").split("\n");

	if (mode == "ADD") {
		content = content.concat([generateExportLine(path)]);
	} else if (mode == "REMOVE") {
		content = content.filter((line) => !line.includes(path));
	} else if (mode == "CREATE") {
		//remove exports that aren't included in createData, unless they are in a comment
		content = content.filter((line) => {
			let min = line.replaceAll(" ", "");
			return !(
				line.includes("export") &&
				min[0] != "/" &&
				min[0] != "*" &&
				!createData.includes(line)
			);
		});

		//add missing exports
		content = content.concat(createData.filter((el) => content.indexOf(el) < 0));
	}

	fs.writeFileSync(CWD + paths[type].exp, content.join("\n"));

	console.log(mode + " " + type + (mode == "CREATE" ? "" : ": " + path));
}

export default function exporterGenerator() {
	for (const type of Object.keys(paths)) {
		const watcher = gulp.watch(paths[type].glob, { cwd: CWD });

		watcher.on("ready", () => {
			touchFile("", type, "CREATE", processWatchedData(watcher.getWatched()));
		});

		watcher.on("add", (path) => {
			touchFile(path, type, "ADD");
		});

		watcher.on("unlink", (path) => {
			touchFile(path, type, "REMOVE");
		});
	}
}
