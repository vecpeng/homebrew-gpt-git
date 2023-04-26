class GptGit < Formula
  desc "Generate Git commit messages with ChatGPT"
  homepage "https://github.com/vecpeng/gpt-git"
  url "https://registry.npmjs.com/gpt-git/-/gpt-git-1.0.0.tgz"
  sha256 "6f945a8bd178759b39098bcbf3f0c6f1501e841f258653b3e1111b06b0494e14"
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *Language::Node.std_npm_install_args(libexec)
    bin.install_symlink(Dir["#{libexec}/bin/*"])
  end

  test do
    system "#{bin}/gpt-git", "--version"
  end
end