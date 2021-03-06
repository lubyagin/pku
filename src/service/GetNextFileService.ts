import fs from 'fs';
import path from 'path';
import logger from '../logger';

// noinspection JSUnfilteredForInLoop
export class GetNextFileService {
    protected lastFileName: any;

    goSignal() {
        try {
            const dirPath = 'files/in/';
            this.lastFileName = GetNextFileService.getMostRecentFile(dirPath);

            if (this.lastFileName) {
                return this.lastFileName.file;
            } else {
                return 'Последний полученный файл не был найден.';
            }
        } catch (e) {
            logger.error(e.message, e.trace);
            return 'Во время получения файла произошла ошибка';
        }
    }

    private static getMostRecentFile = (dir: string) => {
        const files = GetNextFileService.orderReccentFiles(dir);
        return files.length ? files[0] : undefined;
    };

    private static orderReccentFiles = (dir: string) => {
        return fs
            .readdirSync(dir)
            .filter(file => fs.lstatSync(path.join(dir, file)).isFile())
            .map(file => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
            .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    };
}
