import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({ 
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // ¡Solo necesitamos esto aquí!
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // El puente perfecto, limpio y sin peso extra.
}