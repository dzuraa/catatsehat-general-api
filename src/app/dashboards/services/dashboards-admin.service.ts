import { Injectable } from '@nestjs/common';
import { UsersService } from '@app/users/services';
import { ChildrenService } from '@/app/children/children/services';
import { ArticleService } from '@/app/article/services';
import { ScheduleService } from '@/app/schedule/services';

@Injectable()
export class DashboardAdminService {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly articleService: ArticleService,
    private readonly childService: ChildrenService,
    private readonly usersService: UsersService,
  ) {}

  public async findAll() {
    const scheduleTotal = await this.scheduleService.count();
    const article = await this.articleService.count();
    const child = await this.childService.count();
    const user = await this.usersService.count();

    return {
      scheduleTotal: scheduleTotal,
      child: child,
      user: user,
      article: article,
    };
  }
}
