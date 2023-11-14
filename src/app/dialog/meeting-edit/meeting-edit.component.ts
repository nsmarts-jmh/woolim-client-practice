import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-meeting-edit',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './meeting-edit.component.html',
  styleUrls: ['./meeting-edit.component.scss'],
})
export class MeetingEditComponent {
  displayedColumns: string[] = ['meetingTitle', 'meetingDate', 'meetingTime'];

  today = new Date();

  editMeetingForm = new FormGroup({
    meetingTitle: new FormControl('', [Validators.required]),
    meetingDate: new FormControl(this.today, [Validators.required]),
    meetingHour: new FormControl(12),
    meetingMinute: new FormControl(0),
    meetingAmPm: new FormControl('PM'),
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
  am_pmList = [{ value: 'AM' }, { value: 'PM' }];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MeetingEditComponent>
  ) {}

  ngOnInit(): void {
    this.getMeeting();
  }

  getMeeting() {
    if (this.data.meetingDate.getHours() > 12) {
      this.editMeetingForm.patchValue({
        meetingTitle: this.data.meetingTitle,
        meetingDate: this.data.meetingDate,
        meetingAmPm: 'PM',
        meetingHour: this.data.meetingDate.getHours() - 12,
        meetingMinute: this.data.meetingDate.getMinutes(),
      });
    } else {
      this.editMeetingForm.patchValue({
        meetingTitle: this.data.meetingTitle,
        meetingDate: this.data.meetingDate,
        meetingAmPm: 'AM',
        meetingHour: this.data.meetingDate.getHours(),
        meetingMinute: this.data.meetingDate.getMinutes(),
      });
    }
  }

  editMeeting() {
    if (this.editMeetingForm.valid) {
      const formValue = this.editMeetingForm.value;

      // // // PM이고 12시인 경우만 12시이고 그 외의 PM은 +12를 해줌 (ex: PM 11 -> 23)
      if (formValue.meetingHour) {
        if (formValue.meetingAmPm == 'PM' && formValue.meetingHour != 12)
          formValue.meetingHour += 12;
        // AM이고 12시인 경우 00시를 의미하므로 해당 case만 0으로 변경
        if (formValue.meetingAmPm == 'AM' && formValue.meetingHour == 12)
          formValue.meetingHour = 0;
      }

      const yymmdd = moment(formValue.meetingDate).format('YYYY-MM-DD');

      const meetingDate = new Date(
        `${yymmdd} ${formValue.meetingHour}:${formValue.meetingMinute}`
      );

      let setMeeting = {
        meetingTitle: formValue.meetingTitle,
        meetingDate: meetingDate,
      };
      console.log(setMeeting);
      this.dialogRef.close();
    }
  }

  datePickChange(dateValue: any) {
    this.editMeetingForm.get('meetingDate')?.setValue(dateValue);
  }
}