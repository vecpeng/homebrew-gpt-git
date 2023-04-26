// git-commit.js
import { execa } from "execa";
import inquirer from "inquirer";

const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;
const OPEN_AI_API_PROXY = process.env.OPEN_AI_API_PROXY;
// 根据 git diff --cached 获取 commit message 的函数
async function getCommitMessagesFromDiff(diff) {
  // 实现根据 diff 的逻辑来生成 commit message 数组
  try {
    const res = await fetch(`${OPEN_AI_API_PROXY ?? "https://api.openai.com"}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPEN_AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Suggest me a few good commit messages for my commit, following conventional commit (<type>: <subject>) from the diff: ${diff}, `,
          },
        ],
      }),
    });
    const data = await res.json();
    if (data.error) {
        console.error("Error requesting OpenAI API", data.error);
        process.exit(1);
    }
    return data.choices[0].message.content.split('\n');
  } catch (err) {
    console.error("Error requesting OpenAI API", err);
    process.exit(1);
  }
}

async function getGitDiff() {
  try {
    const { stdout } = await execa("git", ["diff", "--cached", "--", ":!package-lock.json", ":!yarn.lock", ":!pnpm-lock.yaml"]);
    return stdout;
  } catch (error) {
    console.error("Error getting git diff", error);
    process.exit(1);
  }
}

async function commitWithMessage(message) {
  try {
    await execa("git", ["commit", "-m", message]);
    console.log("Commit finished");
  } catch (error) {
    console.error("Error committing changes");
    process.exit(1);
  }
}

async function main() {
  const gitDiff = await getGitDiff();
  const commitMessages = await getCommitMessagesFromDiff(gitDiff);
  
  const { selectedMessage } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedMessage",
      message: "Select a commit message:",
      choices: commitMessages,
    },
  ]);

  await commitWithMessage(selectedMessage);
}

main();
