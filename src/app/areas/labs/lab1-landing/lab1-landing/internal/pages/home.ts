import { Component, ChangeDetectionStrategy, signal, computed, Signal } from '@angular/core';
import { PageLayout } from '@ht/shared/ui-common/layouts/page';
import { Clock, Task } from '../widgets/clock';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'ht-home-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageLayout, Clock, DatePipe, DecimalPipe],
  template: `
    <app-ui-page title="lab1">
      <div class="flex flex-row">
        <app-labs-lab1-clock (taskAccomplished)="handleTask($event)"></app-labs-lab1-clock>
      </div>

      <div class="overflow-x-auto">
        <table class="table table-pin-rows">
          <thead>
            <tr>
              <th>Task</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Total Minutes</th>
            </tr>
          </thead>
          <tbody>
            @for (task of taskList(); track task.startTime) {
              <tr class="hover:bg-base-300">
                <th>...</th>
                <td>{{ task.startTime | date: 'shortTime' }}</td>
                <td>{{ task.endTime | date: 'shortTime' }}</td>
                <td>{{ task.minutes }}</td>
              </tr>
            } @empty {
              <div class="alert alert-info">
                <p>No tasks have been set</p>
              </div>
            }
          </tbody>
        </table>
      </div>
      @let s = stats();
      <div class="stats shadow">
        <div class="stat place-items-center">
          <div class="stat-title">Number of Tasks</div>
          <div class="stat-value">{{ s.totalTasks }}</div>
        </div>
        <div class="stat place-items-center">
          <div class="stat-title">Total Minutes on Tasks</div>
          <div class="stat-value">{{ s.totalMinutes }}</div>
        </div>
        <div class="stat place-items-center">
          <div class="stat-title">Average Task Length</div>
          <div class="stat-value">{{ s.averageMinutes | number: '1.0-2' }}</div>
        </div>
        <div class="stat place-items-center">
          <div class="stat-title">Longest Task Duration</div>
          <div class="stat-value">{{ s.longestDuration }}</div>
        </div>
      </div>
    </app-ui-page>
  `,
  styles: ``,
})
export class HomePage {
  private tasks = signal<Task[]>([
    {
      startTime: new Date(),
      endTime: new Date(new Date().setMinutes(new Date().getMinutes() + 25)),
    },
    {
      startTime: new Date(new Date().setHours(new Date().getHours() - 1)),
      endTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)),
    },
  ]);

  handleTask(task: Task): void {
    this.tasks.update((tasks) => [task, ...tasks]);
  }

  taskList: Signal<{ minutes: number; startTime: Date; endTime: Date }[]> = computed(() => {
    return this.tasks().map((task) => {
      const minutes = Math.round((task.endTime.getTime() - task.startTime.getTime()) / 1000 / 60);
      return { ...task, minutes };
    });
  });

  stats: Signal<{
    totalMinutes: number;
    totalTasks: number;
    averageMinutes: number;
    longestDuration: number;
  }> = computed(() => {
    const totalMinutes = this.taskList().reduce((acc, task) => acc + task.minutes, 0);
    const totalTasks = this.taskList().length;
    const averageMinutes = totalTasks === 0 ? 0 : totalMinutes / totalTasks;
    const longestDuration = this.taskList().reduce(
      (max, task) => (task.minutes > max ? task.minutes : max),
      0,
    );
    return {
      totalMinutes,
      totalTasks,
      averageMinutes,
      longestDuration,
    };
  });
}
