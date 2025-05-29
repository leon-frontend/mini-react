# 01. pnpm-workspace.yaml 文件

- **yaml 文件作用**：文件位置在**根目录**，用于配置 **Monorepo 工作区**的配置文件，它告诉 pnpm 哪些目录是**工作区成员**，并使用 pnpm 进行统一管理。其中，工作区成员指一个可以被 pnpm 统一管理的、具有自己 `package.json` 的**项目（或包）目录**。

```yaml
packages:
  - 'packages/*' # 匹配所有 packages 子目录，工作区成员应该在 packages 文件夹下
```

- **工作机制**：每一个 packages 匹配到的子项目必须有自己的 `package.json`。当你在某个包中声明依赖另一个包（如 utils），pnpm 会自动**使用本地引用（软链接）**，而不是从 npm 下载。注意，**所有依赖会被安装到顶层**的 node_modules，提高缓存和依赖复用效率。
- **建立 Monorepo 工作成员之间的本地相互依赖**：1. 先在工作区成员的 `package.json` 文件中声明 `"shared": "workspace:*"` 依赖，然后运行 `pnpm i` 会自动在工作区之间创建软链接；2. 使用命令行指定在 scheduler 工作成员中安装 shared 包。

```bash
# 在 scheduler 工作区中添加对 shared 工作区的依赖，并且希望依赖的是 Monorepo 中的 本地 shared 包（而不是远程版本）
pnpm add shared --filter scheduler --workspace --save # --workspace 表示添加的依赖指向本地的工作区包，而不是远程版本。
# 上述代码会在 scheduler 包的 package.json 文件中生成 "shared": "workspace:^"。

# 其中，--filter 用于限制命令的作用范围，它表示只在指定的工作区内执行操作
--filter web        # 仅影响 web 工作区
--filter "apps/*"   # 影响 apps 文件夹下的所有工作区
--filter "!utils"   # 排除 utils 工作区
```

| 依赖包格式分类            | 描述                                                         |
| :------------------------ | :----------------------------------------------------------- |
| `"shared": "^0.2.0"`      | 依赖**远程版本**的包。版本为 0.2.0 及以上，但不包括 1.0.0，`^` 表示主版本号不变。 |
| `"shared": "workspace:^"` | 始终依赖 Monorepo 中**本地**的 `shared` 包，不会拉取远程版本。 |

