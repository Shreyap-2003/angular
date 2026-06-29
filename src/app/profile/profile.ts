import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDto } from '../profile/user.dto';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {

  user: UserDto | null = null;

  ngOnInit(): void {

    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      this.user = JSON.parse(storedUser) as UserDto;
    }
  }
}