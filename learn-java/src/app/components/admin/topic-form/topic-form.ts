import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContentService } from '../../../services/content';
import { Topic, TopicSection, ContentBlock, BlockType } from '../../../models/topic.model';

@Component({
    selector: 'app-topic-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './topic-form.html',
    styleUrl: './topic-form.css',
})
export class TopicForm implements OnInit {
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private contentService = inject(ContentService);

    topicForm: FormGroup;
    isEditMode = false;
    topicId: string | null = null;

    constructor() {
        this.topicForm = this.fb.group({
            title: ['', Validators.required],
            sections: this.fb.array([this.createSection()])
        });
    }

    get sections(): FormArray {
        return this.topicForm.get('sections') as FormArray;
    }

    getBlocks(sectionIndex: number): FormArray {
        return this.sections.at(sectionIndex).get('blocks') as FormArray;
    }

    createSection(section?: TopicSection): FormGroup {
        const blocksArray = this.fb.array<FormGroup>([]);
        if (section && section.blocks) {
            section.blocks.forEach((b: ContentBlock) => blocksArray.push(this.createBlock(b) as any));
        } else {
            blocksArray.push(this.createBlock({ type: 'theory', value: '' }) as any);
        }

        return this.fb.group({
            blocks: blocksArray
        });
    }

    createBlock(block?: ContentBlock): FormGroup {
        return this.fb.group({
            type: [block?.type || 'theory', Validators.required],
            value: [block?.value || '', Validators.required]
        });
    }

    addSection() {
        this.sections.push(this.createSection());
    }

    removeSection(index: number) {
        if (this.sections.length > 1) {
            this.sections.removeAt(index);
        }
    }

    addBlock(sectionIndex: number, type: BlockType) {
        this.getBlocks(sectionIndex).push(this.createBlock({ type, value: '' }) as any);
    }

    removeBlock(sectionIndex: number, blockIndex: number) {
        const blocks = this.getBlocks(sectionIndex);
        if (blocks.length > 1) {
            blocks.removeAt(blockIndex);
        }
    }

    moveBlock(sectionIndex: number, blockIndex: number, direction: 'up' | 'down') {
        const blocks = this.getBlocks(sectionIndex);
        const newIndex = direction === 'up' ? blockIndex - 1 : blockIndex + 1;

        if (newIndex >= 0 && newIndex < blocks.length) {
            const block = blocks.at(blockIndex);
            blocks.removeAt(blockIndex);
            blocks.insert(newIndex, block as any);
        }
    }

    ngOnInit() {
        this.topicId = this.route.snapshot.paramMap.get('id');
        if (this.topicId) {
            this.isEditMode = true;
            const topic = this.contentService.getTopicById(this.topicId);
            if (topic) {
                this.sections.clear();
                this.topicForm.patchValue({
                    title: topic.title
                });
                topic.sections.forEach((s: TopicSection) => this.sections.push(this.createSection(s) as any));
            }
        }
    }

    onSubmit() {
        if (this.topicForm.valid) {
            if (this.isEditMode && this.topicId) {
                this.contentService.updateTopic(this.topicId, this.topicForm.value);
            } else {
                this.contentService.addTopic(this.topicForm.value);
            }
            this.router.navigate(['/admin']);
        }
    }
}
