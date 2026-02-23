import { Injectable, signal } from '@angular/core';
import { Topic } from '../models/topic.model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private readonly STORAGE_KEY = 'learn_java_topics_v3'; // Storage V3 for blocks-based structure
  private topics = signal<Topic[]>([]);

  constructor() {
    this.loadTopics();
  }

  getTopics() {
    return this.topics.asReadonly();
  }

  getTopicById(id: string) {
    return this.topics().find(t => t.id === id);
  }

  private loadTopics() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.topics.set(JSON.parse(stored));
    } else {
      const initial: Topic[] = [
        {
          id: '1',
          title: 'Java Hello World',
          sections: [
            {
              blocks: [
                { type: 'theory', value: 'Every Java application starts with a main method inside a class.' },
                { type: 'command', value: 'javac Main.java && java Main' },
                { type: 'code', value: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World");\n  }\n}' },
                { type: 'output', value: 'Hello World' }
              ]
            }
          ],
          createdAt: Date.now()
        },
        {
          id: '2',
          title: 'Git Basics',
          sections: [
            {
              blocks: [
                { type: 'theory', value: 'Initialize a new local repository and commit changes.' },
                { type: 'command', value: 'git init' },
                { type: 'output', value: 'Initialized empty Git repository...' },
                { type: 'command', value: 'git add .\ngit commit -m "First commit"' }
              ]
            }
          ],
          createdAt: Date.now()
        }
      ];
      this.topics.set(initial);
      this.saveTopics();
    }
  }

  private saveTopics() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.topics()));
  }

  addTopic(topic: Omit<Topic, 'id' | 'createdAt'>) {
    const newTopic: Topic = {
      ...topic,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now()
    };
    this.topics.update(ts => [...ts, newTopic]);
    this.saveTopics();
  }

  updateTopic(id: string, updates: Partial<Topic>) {
    this.topics.update(ts => ts.map(t => t.id === id ? { ...t, ...updates } : t));
    this.saveTopics();
  }

  deleteTopic(id: string) {
    this.topics.update(ts => ts.filter(t => t.id !== id));
    this.saveTopics();
  }
}
