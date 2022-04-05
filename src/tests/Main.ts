/// <reference types="mocha" />

import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import del from "del";
import * as mkdirp from "mkdirp";
import * as fs from "mz/fs";
import generateMigration from "../cli/generate-migration";
import migrate from "../cli/migrate";
import Config, { TypeDBConfig } from "../Config";
import RecursivePartial from "../type/RecursivePartial";

chai.use(chaiAsPromised);
const expect = chai.expect;


type PartialTypeDBConfig = RecursivePartial<TypeDBConfig>;

describe("CLI", () => {

	before(async () => {
		process.chdir(__dirname);
		del.sync("tmp");
		mkdirp.sync("tmp");
		process.chdir("tmp");
	});

	after(() => {
		process.chdir(__dirname);
		// del.sync("tmp");
	});

	function setConfig (config?: PartialTypeDBConfig) {
		if (!config) {
			try {
				fs.unlinkSync("typedb.json");
			} catch (err: any) {
				if (err.code !== "ENOENT") throw err;
			}
		} else {
			fs.writeFileSync("typedb.json", JSON.stringify(config));
		}
	}

	beforeEach(() => {
		// tslint:disable-next-line no-string-literal
		delete Config["config"];
		setConfig({});
	});

	describe("against cwd with no typedb.json config should error for", () => {
		it("command generate-migration", () => {
			setConfig();
			expect(() => generateMigration("people")).throws();
		});

		it("command migrate", () => {
			setConfig();
			expect(migrate).throws();
		});
	});

	describe("command generate-migration", () => {
		it("should error with an invalid table name", () => {
			expect(() => generateMigration("!@#%")).throws("Table name \"!@#%\" is invalid.");
		});

		it("should error with no table provided", () => {
			expect(() => (generateMigration as any)()).throws("Table name \"undefined\" is invalid.");
		});

		it("should generate an interface and a migration file", () => {
			generateMigration("people");
		});
	});

	describe("command migrate", () => {
		it("should error with an invalid table name", () => {
			expect(() => generateMigration("!@#%")).throws("Table name \"!@#%\" is invalid.");
		});
	});
});
