import { Component, inject, OnInit, AfterViewChecked, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContentService } from '../../services/content';
import { Topic } from '../../models/topic.model';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-git';

@Component({
  selector: 'app-topic-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './topic-detail.html',
  styleUrl: './topic-detail.css',
})
export class TopicDetail implements OnInit, AfterViewChecked {
  private route = inject(ActivatedRoute);
  private contentService = inject(ContentService);

  topic: Topic | undefined;
  copyFeedback = signal<{ sectionIndex: number, blockIndex: number } | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.topic = this.contentService.getTopicById(id);
    }
  }

  ngAfterViewChecked() {
    if (this.topic) {
      Prism.highlightAll();
    }
  }

  copyToClipboard(code: string, sectionIndex: number, blockIndex: number) {
    navigator.clipboard.writeText(code);
    this.copyFeedback.set({ sectionIndex, blockIndex });
    setTimeout(() => this.copyFeedback.set(null), 2000);
  }
}
