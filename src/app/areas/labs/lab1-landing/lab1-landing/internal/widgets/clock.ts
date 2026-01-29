import {
  Component,
  ChangeDetectionStrategy,
  signal,
  output,
  effect,
  WritableSignal,
  OutputEmitterRef,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';

export type Task = {
  startTime: Date;
  endTime: Date;
};

@Component({
  selector: 'app-labs-lab1-clock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
  template: `
    <div class="flex flex-row items-center">
      @if (isTaskRecording()) {
        <button class="btn btn-xs btn-circle btn-success mr-2" (click)="finishTask()">
          <ng-icon name="lucideX" size="20"></ng-icon>
        </button>
        <button class="btn btn-xs btn-circle btn-error mr-2" (click)="cancelTask()">
          <ng-icon name="lucideCircleSlash" size="20"></ng-icon>
        </button>
      } @else {
        <button class="btn btn-xs btn-circle btn-success mr-2" (click)="startTask()">
          <ng-icon name="lucidePlay" size="20"></ng-icon>
        </button>
      }

      <span class="countdown font-mono text-2xl" [class.animate-pulse]="isTaskRecording()">
        <span
          style="--value:{{ currentTime().hours }};"
          aria-live="polite"
          aria-label="{{ currentTime().hours }}"
          >{{ currentTime().hours }}</span
        >
        :
        <span
          style="--value:{{ currentTime().minutes }}; --digits: 2;"
          aria-live="polite"
          aria-label="{{ currentTime().minutes }}"
          >{{ currentTime().minutes }}</span
        >
        :
        <span
          style="--value:{{ currentTime().seconds }}; --digits: 2;"
          aria-live="polite"
          aria-label="{{ currentTime().seconds }}"
          >{{ currentTime().seconds }}</span
        >
      </span>
    </div>
  `,
  styles: ``,
  host: {
    class: 'ml-auto',
  },
})
export class Clock {
  isTaskRecording: WritableSignal<boolean> = signal(false);
  taskAccomplished: OutputEmitterRef<Task> = output<Task>();
  tick: WritableSignal<Date> = signal<Date>(new Date());

  currentTime: WritableSignal<{ hours: number; minutes: number; seconds: number }> = signal({
    hours: this.tick().getHours(),
    minutes: this.tick().getMinutes(),
    seconds: this.tick().getSeconds(),
  });

  private startTime: WritableSignal<Date | null> = signal<Date | null>(null);

  constructor() {
    setInterval(() => {
      this.tick.set(new Date());
    }, 1000);
    effect(() => {
      const now = this.tick();
      this.currentTime.set({
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      });
    });
  }

  startTask(): void {
    this.isTaskRecording.set(true);
    this.startTime.set(new Date());
  }

  cancelTask(): void {
    this.isTaskRecording.set(false);
    this.startTime.set(null);
  }

  finishTask(): void {
    this.isTaskRecording.set(false);
    this.taskAccomplished.emit({
      startTime: this.startTime() || new Date(),
      endTime: new Date(),
    });
    this.startTime.set(null);
  }
}
