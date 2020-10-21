/* jshint node:true */
/* jshint esversion: 6 */
/* jshint -W030 */

const { assert } = require("chai");
const jsonexport = require("../lib/index");
const os = require("os");

describe("Zero", () => {
  it("array", async () => {
    const values = [
      {
        name: "Bob",
        lastName: "Smith",
        age: 0,
        family: {
          name: "Peter",
          type: "Father",
        },
      },
      {
        name: "James",
        lastName: "David",
        age: 21,
        family: {
          name: "Julie",
          type: "Mother",
          size: 0,
        },
      },
      {
        name: "Robert",
        lastName: "Miller",
        age: 24,
        family: {
          name: "Miller",
          size: 12,
        },
        location: [1231, 3214, 4214, 0],
      },
      {
        name: "David",
        lastName: "Martin",
        nickname: "dmartin",
        age: 45,
      },
    ];

    const csv = await jsonexport(values, {});
    assert.equal(
      csv,
      `name,lastName,age,family.name,family.type,family.size,location,nickname${os.EOL}Bob,Smith,0,Peter,Father${os.EOL}James,David,21,Julie,Mother,0${os.EOL}Robert,Miller,24,Miller,,12,1231;3214;4214;0${os.EOL}David,Martin,45,,,,,dmartin`
    );
  });

  it("object", async () => {
    const value = {
      name: "Bob",
      lastName: "Smith",
      age: 0,
      family: {
        name: "Peter",
        type: "Father",
        size: 0,
      },
      location: [1231, 3214, 4214, 0],
    };

    const csv = await jsonexport(value, {});
    assert.equal(
      csv,
      `name,Bob${os.EOL}lastName,Smith${os.EOL}age,0${os.EOL}family.name,Peter${os.EOL}family.type,Father${os.EOL}family.size,0${os.EOL}location,1231;3214;4214;0`
    );
  });
});
