import type { ComponentType } from 'react';
import { Chapter6Models } from './Chapter6Models';
import { Chapter6 } from './Chapter6';
import { Chapter10 } from './Chapter10';
import { Chapter11 } from './Chapter11';
import { AppendixC } from './AppendixC';
import { Chapter9 } from './Chapter9';
import { AppendixReference } from './AppendixReference';

// Only sections with authored explanations get a reader. Search aliases do not
// determine which chapter component runs or suppress the ordinary reading guide.
export const sectionReaders: Readonly<Partial<Record<string, ComponentType<{section:string}>>>> = {
  '6.3': Chapter6, '6.4': Chapter6, '6.5': Chapter6,
  '6.6': Chapter6Models, '6.7': Chapter6Models,
  '9.1': Chapter9, '9.6': Chapter9, '9.7': Chapter9,
  '10.2': Chapter10, '10.3': Chapter10,
  '11.1': Chapter11, '11.4': Chapter11,
  'C.1': AppendixC, 'C.2': AppendixC, 'C.4': AppendixC, 'C.5': AppendixC,
  'A.1': AppendixReference, 'A.2': AppendixReference, 'A.3': AppendixReference,
  'B.1': AppendixReference, 'B.2': AppendixReference, 'B.3': AppendixReference,
};
