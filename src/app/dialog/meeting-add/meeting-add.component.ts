import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-meeting-add',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './meeting-add.component.html',
  styleUrls: ['./meeting-add.component.scss'],
})
export class MeetingAddComponent {
  displayedColumns: string[] = ['title', 'meetingtime', 'meetingTime'];

  addMeetingForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    meetingtime: new FormControl(new Date(), [Validators.required]),
    meetingHour: new FormControl(12),
    meetingMinute: new FormControl(0),
    meetingAmPm: new FormControl('오후'),
  });

  hourList = [
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
    { value: 6 },
    { value: 7 },
    { value: 8 },
    { value: 9 },
    { value: 10 },
    { value: 11 },
    { value: 12 },
  ];
  minuteList = [{ value: 0 }, { value: 15 }, { value: 30 }, { value: 45 }];
  am_pmList = [{ value: '오전' }, { value: '오후' }];

  constructor(public dialogRef: MatDialogRef<MeetingAddComponent>) {}

  addMeeting() {
    if (this.addMeetingForm.valid) {
      const formValue = this.addMeetingForm.value;

      if (formValue.meetingHour) {
        // PM이고 12시인 경우만 12시이고 그 외의 PM은 +12를 해줌 (ex: PM 11 -> 23)
        if (formValue.meetingAmPm == '오후' && formValue.meetingHour != 12) {
          formValue.meetingHour += 12;
          // AM이고 12시인 경우 00시를 의미하므로 해당 case만 0으로 변경
        } else if (
          formValue.meetingAmPm == '오전' &&
          formValue.meetingHour == 12
        ) {
          formValue.meetingHour = 0;
        }
      }

      const yymmdd = moment(formValue.meetingtime).format('YYYY-MM-DD');

      const meetingtime = new Date(
        `${yymmdd} ${formValue.meetingHour}:${formValue.meetingMinute}`
      );

      let setMeeting = {
        title: formValue.title,
        meetingtime: meetingtime,
      };
      console.log(setMeeting);
      this.dialogRef.close();
    }
  }

  datePickChange(dateValue: any) {
    this.addMeetingForm.get('meetingtime')?.setValue(dateValue);
  }
}
