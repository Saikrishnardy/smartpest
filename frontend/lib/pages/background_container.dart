import 'package:flutter/material.dart';

class BackgroundContainer extends StatelessWidget {
  final Widget child;

  const BackgroundContainer({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Background Image
        Positioned.fill(
          child: Opacity(
            opacity: 0.10,
            child: Align(
              alignment: Alignment.center, // Positioning (topRight, center, etc.)
              child: Image.asset(
                'assets/images/logo.png',
                width: 300, // Reduce width
                height: 300, // Reduce height
                fit: BoxFit.contain, // Ensures image isn't stretched
              ),
            ),
          ),
        ),
        // Foreground content
        child,
      ],
    );
  }
}
