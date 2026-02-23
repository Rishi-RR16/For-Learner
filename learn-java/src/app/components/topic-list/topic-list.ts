import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../services/content';

@Component({
  selector: 'app-topic-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './topic-list.html',
  styleUrl: './topic-list.css',
})
export class TopicList {
  private contentService = inject(ContentService);

  searchTerm = signal('');
  topics = this.contentService.getTopics();

  filteredTopics = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.topics().filter(t =>
      t.title.toLowerCase().includes(term)
    );
  });
}
