/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */

const { strictEqual } = require("assert");
const { writeFileSync } = require("fs");
const { join, resolve } = require("path");
const sandbox = require("sinon").createSandbox();
const testLogger = require("./helpers/testLogger");
const botskills = require("../lib/index");
const filledSkillsArray = JSON.stringify(
    {
        "skills": [
            {
                "id": "testSkill"
            },
            {
                "id": "testDispatch"
            }
        ]
    },
    null, 4);

describe("The connect command", function () {
    
    beforeEach(function () {
        writeFileSync(resolve(__dirname, join("mocks", "resources", "filledSkillsArray.json")), filledSkillsArray);
        writeFileSync(resolve(__dirname, join("mocks", "resources", "successfulConnectFiles", "filledSkillsArray.json")), filledSkillsArray);

        this.logger = new testLogger.TestLogger();
        this.connector = new botskills.ConnectSkill(this.logger);
    })

    after(function () {
        writeFileSync(resolve(__dirname, join("mocks", "resources", "filledSkillsArray.json")), filledSkillsArray);
        writeFileSync(resolve(__dirname, join("mocks", "resources", "successfulConnectFiles", "filledSkillsArray.json")), filledSkillsArray);  
    })

	describe("should show an error", function () {
        it("when there is no skills File", async function () {
            const config = {
                botName: "",
                localManifest: "",
                remoteManifest: "",
                dispatchName: "",
                language: "",
                luisFolder: "",
                dispatchFolder: "",
                outFolder: "",
                lgOutFolder: "",
                skillsFile: "",
                resourceGroup: "",
                appSettingsFile: "",
                cognitiveModelsFile: "",
                lgLanguage: "",
                logger: this.logger
            };

            await this.connector.connectSkill(config);
            const errorList = this.logger.getError();

            strictEqual(errorList[errorList.length - 1], `There was an error while connecting the Skill to the Assistant:
Error: Either the 'localManifest' or 'remoteManifest' argument should be passed.`);
        });

        it("when the localManifest points to a nonexisting Skill manifest file", async function () {
            const config = {
                botName: "",
                localManifest: resolve(__dirname, join("mocks", "resources", "nonexistentSkill.json")),
                remoteManifest: "",
                dispatchName: "",
                language: "",
                luisFolder: "",
                dispatchFolder: "",
                outFolder: "",
                lgOutFolder: "",
                skillsFile: "",
                resourceGroup: "",
                appSettingsFile: "",
                cognitiveModelsFile: "",
                lgLanguage: "",
                logger: this.logger
            };

            await this.connector.connectSkill(config);
            const errorList = this.logger.getError();

            strictEqual(errorList[errorList.length - 1], `There was an error while connecting the Skill to the Assistant:
Error: The 'localManifest' argument leads to a non-existing file. Please make sure to provide a valid path to your Skill manifest.`);
        });

        it("when the Skill is missing all mandatory fields", async function () {
            const config = {
                botName: "",
                localManifest: resolve(__dirname, join("mocks", "resources", "invalidSkill.json")),
                remoteManifest: "",
                dispatchName: "",
                language: "",
                luisFolder: "",
                dispatchFolder: "",
                outFolder: "",
                lgOutFolder: "",
                skillsFile: "",
                resourceGroup: "",
                appSettingsFile: "",
                cognitiveModelsFile: "",
                lgLanguage: "",
                logger: this.logger
            };

            const errorMessages = [
                `Missing property 'name' of the manifest`,
                `Missing property 'id' of the manifest`,
                `Missing property 'endpoint' of the manifest`,
                `Missing property 'authenticationConnections' of the manifest`,
                `Missing property 'actions' of the manifest`
            ]

            await this.connector.connectSkill(config);
            const errorList = this.logger.getError();

            errorList.forEach((errorMessage, index) => {
                strictEqual(errorMessage, errorMessages[index]);
            });
        });

        it("when the Skill has an invalid id field", async function () {
            const config = {
                botName: "",
                localManifest: resolve(__dirname, join("mocks", "resources", "invalidSkillid.json")),
                remoteManifest: "",
                dispatchName: "",
                language: "",
                luisFolder: "",
                dispatchFolder: "",
                outFolder: "",
                lgOutFolder: "",
                skillsFile: "",
                resourceGroup: "",
                appSettingsFile: "",
                cognitiveModelsFile: "",
                lgLanguage: "",
                logger: this.logger
            };

            await this.connector.connectSkill(config);
            const errorList = this.logger.getError();

            strictEqual(errorList[errorList.length - 1], `The 'id' of the manifest contains some characters not allowed. Make sure the 'id' contains only letters, numbers and underscores, but doesn't start with number.`);
        });

        it("when the remoteManifest points to a nonexisting Skill manifest URL", async function() {
            const config = {
                botName: "",
                localManifest: "",
                remoteManifest: "http://nonexistentSkill.azurewebsites.net/api/skill/manifest",
                dispatchName: "",
                language: "",
                luisFolder: "",
                dispatchFolder: "",
                outFolder: "",
                lgOutFolder: "",
                skillsFile: "",
                resourceGroup: "",
                appSettingsFile: "",
                cognitiveModelsFile: "",
                lgLanguage: "",
                logger: this.logger
            };

            await this.connector.connectSkill(config);
            const errorList = this.logger.getError();

            strictEqual(errorList[errorList.length - 1], `There was an error while connecting the Skill to the Assistant:
RequestError: Error: getaddrinfo ENOTFOUND nonexistentskill.azurewebsites.net nonexistentskill.azurewebsites.net:80`);
        });

        it("when the luisFolder leads to a nonexistent folder", async function () {
            const config = {
                botName: "",
                localManifest: resolve(__dirname, join("mocks", "resources", "connectableSkill.json")),
                remoteManifest: "",
                dispatchName: "",
                language: "",
                luisFolder: resolve(__dirname, join("mocks", "resources", "nonexistentLuisFolder")),
                dispatchFolder: "",
                outFolder: "",
                lgOutFolder: "",
                skillsFile: resolve(__dirname, join("mocks", "resources", "filledSkillsArray.json")),
                resourceGroup: "",
                appSettingsFile: "",
                cognitiveModelsFile: "",
                lgLanguage: "",
                logger: this.logger
            };

            await this.connector.connectSkill(config);
            const errorList = this.logger.getError();

            strictEqual(errorList[errorList.length - 1], `There was an error while connecting the Skill to the Assistant:
Error: An error ocurred while updating the Dispatch model:
Error: Path to the LUIS folder (${config.luisFolder}) leads to a nonexistent folder.`);
        });

        it("when the .lu file path leads to a nonexistent file", async function () {
            const config = {
                botName: "",
                localManifest: resolve(__dirname, join("mocks", "resources", "connectableSkill.json")),
                remoteManifest: "",
                dispatchName: "",
                language: "",
                luisFolder: resolve(__dirname, join("mocks", "resources")),
                dispatchFolder: "",
                outFolder: "",
                lgOutFolder: "",
                skillsFile: resolve(__dirname, join("mocks", "resources", "filledSkillsArray.json")),
                resourceGroup: "",
                appSettingsFile: "",
                cognitiveModelsFile: "",
                lgLanguage: "",
                logger: this.logger
            };

            await this.connector.connectSkill(config);
            const errorList = this.logger.getError();

            strictEqual(errorList[errorList.length - 1], `There was an error while connecting the Skill to the Assistant:
Error: An error ocurred while updating the Dispatch model:
Error: Path to the connectableSkill.lu file leads to a nonexistent file.`);
        });

        it("when the dispatch folder path leads to a nonexistent folder", async function () {
            const config = {
                botName: "",
                localManifest: resolve(__dirname, join("mocks", "resources", "connectableSkill.json")),
                remoteManifest: "",
                dispatchName: "",
                language: "",
                luisFolder: resolve(__dirname, join("mocks", "resources", "luisFolder")),
                dispatchFolder: resolve(__dirname, join("mocks", "resources", "nonexistentDispatchFolder")),
                outFolder: "",
                lgOutFolder: "",
                skillsFile: resolve(__dirname, join("mocks", "resources", "filledSkillsArray.json")),
                resourceGroup: "",
                appSettingsFile: "",
                cognitiveModelsFile: "",
                lgLanguage: "",
                logger: this.logger
            };

            await this.connector.connectSkill(config);
            const errorList = this.logger.getError();

            strictEqual(errorList[errorList.length - 1], `There was an error while connecting the Skill to the Assistant:
Error: An error ocurred while updating the Dispatch model:
Error: Path to the Dispatch folder (${config.dispatchFolder}) leads to a nonexistent folder.`);
        });

        it("when the .dispatch file path leads to a nonexistent file", async function () {
            const config = {
                botName: "",
                localManifest: resolve(__dirname, join("mocks", "resources", "connectableSkill.json")),
                remoteManifest: "",
                dispatchName: "nonexistentDispatchFile",
                language: "",
                luisFolder: resolve(__dirname, join("mocks", "resources", "luisFolder")),
                dispatchFolder: resolve(__dirname, join("mocks", "resources", "dispatchFolder")),
                outFolder: "",
                lgOutFolder: "",
                skillsFile: resolve(__dirname, join("mocks", "resources", "filledSkillsArray.json")),
                resourceGroup: "",
                appSettingsFile: "",
                cognitiveModelsFile: "",
                lgLanguage: "",
                logger: this.logger
            };

            await this.connector.connectSkill(config);
            const errorList = this.logger.getError();
            
            strictEqual(errorList[errorList.length - 1], `There was an error while connecting the Skill to the Assistant:
Error: An error ocurred while updating the Dispatch model:
Error: Path to the ${config.dispatchName}.dispatch file leads to a nonexistent file.`);
        });

        it("when the .luis file path leads to a nonexistent file", async function () {
            sandbox.replace(this.connector.childProcessUtils, "execute", (command, args) => {
                return Promise.resolve("Mocked function successfully");
            });
            const config = {
                botName: "",
                localManifest: resolve(__dirname, join("mocks", "resources", "connectableSkill.json")),
                remoteManifest: "",
                dispatchName: "connectableSkill",
                language: "",
                luisFolder: resolve(__dirname, join("mocks", "resources", "luFolder")),
                dispatchFolder: resolve(__dirname, join("mocks", "resources", "dispatchFolder")),
                outFolder: "",
                lgOutFolder: "",
                skillsFile: resolve(__dirname, join("mocks", "resources", "filledSkillsArray.json")),
                resourceGroup: "",
                appSettingsFile: "",
                cognitiveModelsFile: "",
                lgLanguage: "",
                logger: this.logger
            };

            await this.connector.connectSkill(config);
            const errorList = this.logger.getError();

            strictEqual(errorList[errorList.length - 1], `There was an error while connecting the Skill to the Assistant:
Error: An error ocurred while updating the Dispatch model:
Error: Path to ${config.dispatchName}.luis (${join(config.luisFolder, config.dispatchName)}.luis) leads to a nonexistent file. Make sure the ludown command is being executed successfully`);
        });

        it("when the refreshSkill fails", async function () {
            sandbox.replace(this.connector.childProcessUtils, "execute", (command, args) => {
                return Promise.resolve("Mocked function successfully");
            });
            sandbox.replace(this.connector.refreshSkill, "refreshSkill", (command, args) => {
                return Promise.resolve(false);
            });
            const config = {
                botName: "",
                localManifest: resolve(__dirname, join("mocks", "resources", "connectableSkill.json")),
                remoteManifest: "",
                dispatchName: "connectableSkill",
                language: "",
                luisFolder: resolve(__dirname, join("mocks", "resources", "luisFolder")),
                dispatchFolder: resolve(__dirname, join("mocks", "resources", "dispatchFolder")),
                outFolder: "",
                lgOutFolder: "",
                skillsFile: resolve(__dirname, join("mocks", "resources", "filledSkillsArray.json")),
                resourceGroup: "",
                appSettingsFile: "",
                cognitiveModelsFile: "",
                lgLanguage: "",
                logger: this.logger
            };

            await this.connector.connectSkill(config);
            const errorList = this.logger.getError();

            strictEqual(errorList[errorList.length - 1], `There was an error while connecting the Skill to the Assistant:
Error: An error ocurred while updating the Dispatch model:
Error: There was an error while refreshing the Dispatch model.`);
        });
    });

    describe("should show a warning", function () {
        it("when the Skill is already connected", async function () {
            const config = {
                botName: "",
                localManifest: resolve(__dirname, join("mocks", "resources", "testSkill.json")),
                remoteManifest: "",
                dispatchName: "",
                language: "",
                luisFolder: "",
                dispatchFolder: "",
                outFolder: "",
                lgOutFolder: "",
                skillsFile: resolve(__dirname, join("mocks", "resources", "filledSkillsArray.json")),
                resourceGroup: "",
                appSettingsFile: "",
                cognitiveModelsFile: "",
                lgLanguage: "",
                logger: this.logger
            };

            await this.connector.connectSkill(config);
            const warningList = this.logger.getWarning();
            
			strictEqual(warningList[warningList.length - 1], `The skill 'Test Skill' is already registered.`);
        });

        it("when the noRefresh argument is present", async function () {
            sandbox.replace(this.connector.childProcessUtils, "execute", (command, args) => {
                return Promise.resolve("Mocked function successfully");
            });
            sandbox.replace(this.connector.authenticationUtils, "authenticate", (configuration, manifest, logger) => {
                return Promise.resolve("Mocked function successfully");
            });
            sandbox.replace(this.connector.refreshSkill, "refreshSkill", (command, args) => {
                return Promise.resolve(true);
            });
            const config = {
                botName: "",
                localManifest: resolve(__dirname, join("mocks", "resources", "connectableSkill.json")),
                remoteManifest: "",
                noRefresh: true,
                dispatchName: "connectableSkill",
                language: "",
                luisFolder: resolve(__dirname, join("mocks", "resources", "successfulConnectFiles")),
                dispatchFolder: resolve(__dirname, join("mocks", "resources", "successfulConnectFiles")),
                outFolder: "",
                lgOutFolder: "",
                skillsFile: resolve(__dirname, join("mocks", "resources", "filledSkillsArray.json")),
                resourceGroup: "",
                appSettingsFile: "",
                cognitiveModelsFile: "",
                lgLanguage: "",
                logger: this.logger
            };

            await this.connector.connectSkill(config);
            const warningList = this.logger.getWarning();

            strictEqual(warningList[warningList.length - 1], `Appending 'Test Skill' manifest to your assistant's skills configuration file.`);
            strictEqual(warningList[warningList.length - 2], `Run 'botskills refresh --${config.lgLanguage}' command to refresh your connected skills`);
        });
    });

    describe("should show a message", function () {
        it("when the skill is successfully connected to the Assistant", async function () {
            sandbox.replace(this.connector.childProcessUtils, "execute", (command, args) => {
                return Promise.resolve("Mocked function successfully");
            });
            sandbox.replace(this.connector.authenticationUtils, "authenticate", (configuration, manifest, logger) => {
                return Promise.resolve("Mocked function successfully");
            });
            sandbox.replace(this.connector.refreshSkill, "refreshSkill", (command, args) => {
                return Promise.resolve(true);
            });
            const config = {
                botName: "",
                localManifest: resolve(__dirname, join("mocks", "resources", "successfulConnectFiles", "connectableSkill.json")),
                remoteManifest: "",
                dispatchName: "connectableSkill",
                language: "",
                luisFolder: resolve(__dirname, join("mocks", "resources", "successfulConnectFiles")),
                dispatchFolder: resolve(__dirname, join("mocks", "resources", "successfulConnectFiles")),
                outFolder: "",
                lgOutFolder: "",
                skillsFile: resolve(__dirname, join("mocks", "resources", "successfulConnectFiles", "filledSkillsArray.json")),
                resourceGroup: "",
                appSettingsFile: "",
                cognitiveModelsFile: "",
                lgLanguage: "",
                logger: this.logger
            };

            await this.connector.connectSkill(config);
            const messageList = this.logger.getMessage();

			strictEqual(messageList[messageList.length - 1], `Configuring bot auth settings`);
		});
	});
});
