import deepmerge from "deepmerge";
import * as json from "jsonfile";
import * as path from "path";

export interface TypeDBConfig {
	paths: {
		root: string;
		tables: string;
		migrations: string;
	};
}

export const defaultConfig: TypeDBConfig = {
	paths: {
		root: "",
		tables: "tables",
		migrations: "tables/migrations",
	},
};

class Config {
	private cwd: string | undefined;
	private config?: TypeDBConfig;

	public getPath (pathName: keyof TypeDBConfig["paths"], cwd = process.cwd()) {
		const config = this.get();
		if (pathName === "root") return config.paths.root;
		return path.join(config.paths.root, config.paths[pathName]);
	}

	public get (cwd?: string) {
		if (cwd === undefined) cwd = this.cwd = this.cwd || process.cwd();
		else if (cwd !== this.cwd) this.cwd = cwd; // switch to a config in a new location
		else if (this.config) return this.config; // this config was already loaded

		while (true) {
			try {
				this.config = deepmerge(defaultConfig, json.readFileSync(path.join(this.cwd, "typedb.json")));
				// if we made it this far, we successfully found the typedb.json
				return this.config;

			} catch {
				// there was no typedb.json in the cwd, so we need to move up a folder to try again
				const dirname = path.dirname(this.cwd);

				// if the parent folder is the same as the current folder, we've reached the root
				if (dirname === this.cwd) break;

				// if not, we set the cwd to the parent and continue
				this.cwd = dirname;
			}
		}

		delete this.cwd;
		throw new Error("No typedb.json config file found.");
	}
}

export default new Config;
