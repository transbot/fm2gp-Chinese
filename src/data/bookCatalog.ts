import { algorithmCatalog, searchAlgorithms } from './algorithmCatalog';
export { conceptLessons } from './conceptLessons';
import { bookContent } from './bookContent';
export const bookCatalog = bookContent.chapters;
export const chapterExercises = bookContent.exercises;
export const bookResources = bookContent.resources;
export const sectionAnchor = (id: string) => `section-${id.replace(/\./g, '-')}`;
export const exerciseAnchor = (id: string) => `exercise-${id.replace(/\./g, '-')}`;
export const repoFile = (path: string, line?: number) => `https://github.com/transbot/fm2gp-Chinese/blob/main/${path.split('/').map(encodeURIComponent).join('/')}${line ? `#L${line}` : ''}`;
export function sectionAlgorithms(id: string) {
    return algorithmCatalog.filter(a => {
        if (a.source.type !== 'book' || !a.source.section)
            return false;
        const [first, last] = a.source.section.split('-');
        if (!last)
            return first === id;
        return id.split('.')[0] === first.split('.')[0] && Number(id.split('.')[1]) >= Number(first.split('.')[1]) && Number(id.split('.')[1]) <= Number(last.split('.')[1]);
    });
}
export function algorithmBookLink(id: string) {
    const a = algorithmCatalog.find(a => a.id === id);
    if (!a?.source.section)
        return undefined;
    const section = a.source.section.split('-')[0];
    return `/book/${section.split('.')[0]}#${a.source.type === 'exercise' ? exerciseAnchor(section) : sectionAnchor(section)}`;
}
export function searchBook(query: string) {
    const q = query.toLowerCase().replace(/\s/g, '').replace('二叉', '二分');
    const explicitExercise = /习题|exercise/.test(q), explicitSection = /第.*节|section/.test(q);
    const number = q.match(/\d+\.\d+/)?.[0];
    const needle = q.replace(/习题|exercise|section|第|节/g, '');
    const lessonHits = searchAlgorithms({ query: needle, lang: 'en', sourceType: 'book' });
    return bookCatalog.map(ch => {
        const related = bookResources.filter(r => r.chapter === ch.id).map(r => r.path + ' ' + ('functions' in r ? r.functions?.map(f => f.name).join(' ') : '')).join(' ');
        const matchChapter = !explicitExercise && !explicitSection && `${ch.title.zh}${ch.title.en}${related}`.toLowerCase().replace(/\s/g, '').includes(needle);
        const sections = ch.sections.filter(s => !explicitExercise && (explicitSection && number ? s.id === number : matchChapter || lessonHits.some(lesson => lesson.sections.includes(s.id)) || `${s.id}${s.title.zh}${s.title.en}${sectionAlgorithms(s.id).map(a => a.id + ' ' + a.summary.zh + ' ' + a.summary.en).join(' ')}`.toLowerCase().replace(/\s/g, '').replace('二叉', '二分').includes(needle)));
        const exercises = chapterExercises.filter(e => e.id.split('.')[0] === ch.id && !explicitSection && (!q || matchChapter || e.id === (number || needle)));
        return { ...ch, sections, exercises };
    }).filter(c => !q || c.sections.length || c.exercises.length || `${c.id}${c.title.zh}${c.title.en}`.toLowerCase().includes(needle));
}
