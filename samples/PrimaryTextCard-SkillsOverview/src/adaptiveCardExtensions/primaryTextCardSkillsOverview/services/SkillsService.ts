import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { SPFI, spfi, SPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/folders';
import '@pnp/sp/files';
import { ISkill } from '../models/ISkill';

interface IFileItem {
  Name: string;
  ServerRelativeUrl: string;
  TimeCreated: string;
}

interface IFolderItem {
  Name: string;
  ServerRelativeUrl: string;
}

interface IParsedSkill {
  title: string;
  description: string;
}

export class SkillsService {
  private static readonly LIBRARY_TITLE: string = 'AgentAssets';
  private static readonly SKILLS_FOLDER: string = 'Skills';
  private static readonly MAX_DESCRIPTION_LENGTH: number = 500;
  private static readonly DEFAULT_DESCRIPTION: string = '(No description provided)';
  private static readonly MAX_SUBFOLDERS: number = 5000;
  private static readonly MAX_FILES_PER_FOLDER: number = 5000;

  private readonly _sp: SPFI;

  public constructor(private readonly context: AdaptiveCardExtensionContext) {
    this._sp = spfi().using(SPFx(this.context));
  }

  public async getSkillsCount(): Promise<number> {
    const subfolders: IFolderItem[] | undefined = await this.getSkillSubfolders();
    if (subfolders === undefined || subfolders.length === 0) {
      return 0;
    }

    const counts: number[] = await Promise.all(
      subfolders.map(
        (folder: IFolderItem): Promise<number> => this.safeCountMarkdownFilesInFolder(folder.ServerRelativeUrl)
      )
    );

    let total: number = 0;
    for (const count of counts) {
      total += count;
    }
    return total;
  }

  public async getLatestSkill(): Promise<ISkill | undefined> {
    const subfolders: IFolderItem[] | undefined = await this.getSkillSubfolders();
    if (subfolders === undefined || subfolders.length === 0) {
      return undefined;
    }

    const candidates: (IFileItem | undefined)[] = await Promise.all(
      subfolders.map(
        (folder: IFolderItem): Promise<IFileItem | undefined> =>
          this.safeGetNewestMarkdownInFolder(folder.ServerRelativeUrl)
      )
    );

    let latest: IFileItem | undefined;
    let latestTime: number = Number.NEGATIVE_INFINITY;
    for (const candidate of candidates) {
      if (candidate === undefined) {
        continue;
      }
      const candidateTime: number = new Date(candidate.TimeCreated).getTime();
      if (candidateTime > latestTime) {
        latest = candidate;
        latestTime = candidateTime;
      }
    }

    if (latest === undefined) {
      return undefined;
    }

    const markdown: string = await this._sp.web
      .getFileByServerRelativePath(latest.ServerRelativeUrl)
      .getText();
    const parsed: IParsedSkill = this.parseSkillMarkdown(markdown, latest.Name);

    return {
      title: parsed.title,
      description: parsed.description,
      created: new Date(latest.TimeCreated),
      serverRelativeUrl: latest.ServerRelativeUrl,
      fileName: latest.Name
    };
  }

  public async getLatestSkills(top: number): Promise<ISkill[]> {
    if (top <= 0) {
      return [];
    }

    const subfolders: IFolderItem[] | undefined = await this.getSkillSubfolders();
    if (subfolders === undefined || subfolders.length === 0) {
      return [];
    }

    const perFolder: IFileItem[][] = await Promise.all(
      subfolders.map(
        (folder: IFolderItem): Promise<IFileItem[]> =>
          this.safeListMarkdownInFolder(folder.ServerRelativeUrl)
      )
    );

    const candidates: IFileItem[] = [];
    for (const folderFiles of perFolder) {
      for (const file of folderFiles) {
        candidates.push(file);
      }
    }

    candidates.sort(
      (a: IFileItem, b: IFileItem): number =>
        new Date(b.TimeCreated).getTime() - new Date(a.TimeCreated).getTime()
    );

    const selected: IFileItem[] = candidates.slice(0, top);

    const skills: (ISkill | undefined)[] = await Promise.all(
      selected.map((file: IFileItem): Promise<ISkill | undefined> => this.safeReadSkill(file))
    );

    const result: ISkill[] = [];
    for (const skill of skills) {
      if (skill !== undefined) {
        result.push(skill);
      }
    }
    return result;
  }

  private async safeListMarkdownInFolder(folderServerRelativeUrl: string): Promise<IFileItem[]> {
    try {
      const files: IFileItem[] = await this._sp.web
        .getFolderByServerRelativePath(folderServerRelativeUrl)
        .files
        .select('Name', 'ServerRelativeUrl', 'TimeCreated')
        .orderBy('TimeCreated', false)
        .top(SkillsService.MAX_FILES_PER_FOLDER)();

      if (!Array.isArray(files)) {
        return [];
      }

      const markdownFiles: IFileItem[] = [];
      for (const file of files) {
        if (file.Name.toLowerCase().endsWith('.md')) {
          markdownFiles.push(file);
        }
      }
      return markdownFiles;
    } catch {
      // Skip this subfolder on any error so a single bad folder does not break the aggregate.
      return [];
    }
  }

  private async safeReadSkill(file: IFileItem): Promise<ISkill | undefined> {
    try {
      const markdown: string = await this._sp.web
        .getFileByServerRelativePath(file.ServerRelativeUrl)
        .getText();
      const parsed: IParsedSkill = this.parseSkillMarkdown(markdown, file.Name);

      return {
        title: parsed.title,
        description: parsed.description,
        created: new Date(file.TimeCreated),
        serverRelativeUrl: file.ServerRelativeUrl,
        fileName: file.Name
      };
    } catch {
      // Skip this file on any error so a single bad file does not break the aggregate.
      return undefined;
    }
  }

  private async getSkillSubfolders(): Promise<IFolderItem[] | undefined> {
    const folderUrl: string = this.buildFolderUrl();

    try {
      const folders: IFolderItem[] = await this._sp.web
        .getFolderByServerRelativePath(folderUrl)
        .folders
        .select('Name', 'ServerRelativeUrl')
        .top(SkillsService.MAX_SUBFOLDERS)();

      return Array.isArray(folders) ? folders : [];
    } catch (error) {
      if (this.isNotFound(error)) {
        return undefined;
      }
      if (error instanceof Error) {
        throw new Error(`Failed to enumerate skill subfolders: ${error.message}`);
      }
      throw new Error('Unexpected error while enumerating skill subfolders.');
    }
  }

  private async safeCountMarkdownFilesInFolder(folderServerRelativeUrl: string): Promise<number> {
    try {
      const files: { Name: string }[] = await this._sp.web
        .getFolderByServerRelativePath(folderServerRelativeUrl)
        .files
        .select('Name')
        .top(SkillsService.MAX_FILES_PER_FOLDER)();

      if (!Array.isArray(files)) {
        return 0;
      }

      let count: number = 0;
      for (const file of files) {
        if (file.Name.toLowerCase().endsWith('.md')) {
          count += 1;
        }
      }
      return count;
    } catch {
      // Skip this subfolder on any error so a single bad folder does not break the aggregate.
      return 0;
    }
  }

  private async safeGetNewestMarkdownInFolder(folderServerRelativeUrl: string): Promise<IFileItem | undefined> {
    try {
      const files: IFileItem[] = await this._sp.web
        .getFolderByServerRelativePath(folderServerRelativeUrl)
        .files
        .select('Name', 'ServerRelativeUrl', 'TimeCreated')
        .orderBy('TimeCreated', false)
        .top(SkillsService.MAX_FILES_PER_FOLDER)();

      if (!Array.isArray(files)) {
        return undefined;
      }

      for (const file of files) {
        if (file.Name.toLowerCase().endsWith('.md')) {
          return file;
        }
      }
      return undefined;
    } catch {
      // Skip this subfolder on any error so a single bad folder does not break the aggregate.
      return undefined;
    }
  }

  private buildFolderUrl(): string {
    const webServerRelativeUrl: string = this.context.pageContext.web.serverRelativeUrl;
    const webSegments: string[] = webServerRelativeUrl
      .split('/')
      .filter((segment: string) => segment.length > 0)
      .map((segment: string) => encodeURIComponent(segment));

    const folderSegments: string[] = [
      encodeURIComponent(SkillsService.LIBRARY_TITLE),
      encodeURIComponent(SkillsService.SKILLS_FOLDER)
    ];

    return `/${[...webSegments, ...folderSegments].join('/')}`;
  }

  private isNotFound(error: unknown): boolean {
    const maybe: { isHttpRequestError?: boolean; status?: number; response?: { status?: number } } =
      error as { isHttpRequestError?: boolean; status?: number; response?: { status?: number } };
    if (maybe && maybe.isHttpRequestError === true) {
      return maybe.status === 404 || maybe.response?.status === 404;
    }
    return false;
  }

  private parseFrontmatter(normalized: string, fileName: string): IParsedSkill | undefined {
    // Frontmatter must start at the very first line with `---` and end with a
    // matching `---` on its own line. Returns undefined when absent or malformed.
    if (!normalized.startsWith('---\n')) {
      return undefined;
    }
    const endIndex: number = normalized.indexOf('\n---', 4);
    if (endIndex < 0) {
      return undefined;
    }
    const block: string = normalized.substring(4, endIndex);
    const blockLines: string[] = block.split('\n');

    let name: string = '';
    let description: string = '';
    let current: 'name' | 'description' | undefined;
    const descriptionParts: string[] = [];

    for (const rawLine of blockLines) {
      const keyMatch: RegExpExecArray | null = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(rawLine);
      if (keyMatch !== null) {
        const key: string = keyMatch[1].toLowerCase();
        const value: string = this.stripYamlQuotes(keyMatch[2].trim());
        if (key === 'name') {
          name = value;
          current = 'name';
        } else if (key === 'description') {
          if (value.length > 0) {
            descriptionParts.push(value);
          }
          current = 'description';
        } else {
          current = undefined;
        }
        continue;
      }
      // Continuation line (folded/multi-line YAML scalar) for the active key.
      if (current === 'description') {
        const trimmed: string = rawLine.trim();
        if (trimmed.length > 0) {
          descriptionParts.push(trimmed);
        }
      }
    }

    description = descriptionParts.join(' ').trim();

    if (name.length === 0 && description.length === 0) {
      return undefined;
    }

    const title: string = name.length > 0 ? name : fileName.replace(/\.md$/i, '');
    return { title, description };
  }

  private stripYamlQuotes(value: string): string {
    if (value.length >= 2) {
      const first: string = value.charAt(0);
      const last: string = value.charAt(value.length - 1);
      if ((first === '"' && last === '"') || (first === '\'' && last === '\'')) {
        return value.substring(1, value.length - 1);
      }
    }
    return value;
  }

  private parseSkillMarkdown(md: string, fileName: string): IParsedSkill {
    const normalized: string = md.replace(/^\uFEFF/, '').replace(/\r/g, '');

    // If the file begins with YAML frontmatter (--- ... ---), prefer its
    // `name` and `description` fields over heading-based parsing. This matches
    // the agent skill file format (see skill-sample.md).
    const frontmatter: IParsedSkill | undefined = this.parseFrontmatter(normalized, fileName);
    if (frontmatter !== undefined) {
      let frontDescription: string = frontmatter.description;
      if (frontDescription.length > SkillsService.MAX_DESCRIPTION_LENGTH) {
        frontDescription = `${frontDescription.substring(0, SkillsService.MAX_DESCRIPTION_LENGTH)}…`;
      }
      if (frontDescription.length === 0) {
        frontDescription = SkillsService.DEFAULT_DESCRIPTION;
      }
      return { title: frontmatter.title, description: frontDescription };
    }

    const lines: string[] = normalized.split('\n');

    let title: string = fileName.replace(/\.md$/i, '');
    let h1Index: number = -1;
    for (let i: number = 0; i < lines.length; i++) {
      const line: string = lines[i];
      if (/^#\s+/.test(line)) {
        title = line.replace(/^#\s+/, '').trim() || title;
        h1Index = i;
        break;
      }
    }

    let description: string = '';

    let descriptionHeadingIndex: number = -1;
    for (let i: number = 0; i < lines.length; i++) {
      if (/^#{1,6}\s+description\s*$/i.test(lines[i])) {
        descriptionHeadingIndex = i;
        break;
      }
    }

    if (descriptionHeadingIndex >= 0) {
      const collected: string[] = [];
      for (let i: number = descriptionHeadingIndex + 1; i < lines.length; i++) {
        const line: string = lines[i];
        if (/^#{1,6}\s/.test(line)) {
          break;
        }
        const trimmed: string = line.trim();
        if (trimmed.length > 0) {
          collected.push(trimmed);
        }
      }
      description = collected.join(' ').trim();
    } else {
      const startIndex: number = h1Index >= 0 ? h1Index + 1 : 0;
      const collected: string[] = [];
      let started: boolean = false;
      for (let i: number = startIndex; i < lines.length; i++) {
        const line: string = lines[i];
        const trimmed: string = line.trim();
        if (/^#{1,6}\s/.test(line)) {
          if (started) {
            break;
          }
          continue;
        }
        if (trimmed.length === 0) {
          if (started) {
            break;
          }
          continue;
        }
        collected.push(trimmed);
        started = true;
      }
      description = collected.join(' ').trim();
    }

    if (description.length > SkillsService.MAX_DESCRIPTION_LENGTH) {
      description = `${description.substring(0, SkillsService.MAX_DESCRIPTION_LENGTH)}…`;
    }

    if (description.length === 0) {
      description = SkillsService.DEFAULT_DESCRIPTION;
    }

    return { title, description };
  }
}

