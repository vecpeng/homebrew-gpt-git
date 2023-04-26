class MyTool < Formula
    desc "Generate Git commit messages with ChatGPT"
    homepage "https://github.com/vecpeng/gpt-git"
    url "https://www.npmjs.com/package/gpt-git/-/gpt-git-1.0.0.tgz"
    sha256 "THE_SHA256_FOR_YOUR_PACKAGE"
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