const initDB = `
CREATE TABLE "goods" (
	"name"	INTEGER,
	"code"	INTEGER
);
CREATE TABLE "label" (
	"lastUpdate"	TEXT
);
CREATE TABLE "peanuts" (
	"size"		TEXT,
	"texture"	TEXT,
	"color"		TEXT
);
CREATE TABLE "tape" (
	"name"	TEXT
);
`;
export default initDB;