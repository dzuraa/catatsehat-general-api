import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { User } from '@prisma/client';
import { CheckupMothersPublicService } from '@/app/mother/checkup-mother/services';
import { CheckupChildrenService } from '@/app/children/checkup-children/services';
import { ScheduleService } from '@/app/schedule/services';
import { ArticleService } from '@/app/article/services';
// import { UsersService } from '@src/app/users/services';

@Injectable()
export class DashboardService {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly articleService: ArticleService,
    private readonly checkupMotherService: CheckupMothersPublicService,
    private readonly checkupChildService: CheckupChildrenService,
  ) {}

  public async findAll(user: User) {
    const schedule = await this.scheduleService.paginate(
      new PaginationQueryDto(),
    );
    const article = await this.articleService.paginate(
      new PaginationQueryDto(),
    );
    const checkupChild = await this.checkupChildService.countChildren(user.id);
    const checkupMother = await this.checkupMotherService.countMothers(user.id);
    // const userInfo = await this.usersService.detail(user.id);

    return {
      schedule: schedule.data,
      article: article.data,
      checkupChild: checkupChild,
      checkupMother: checkupMother,
      checkupTotal: checkupChild + checkupMother,
      // user: userInfo,
    };
  }
}
