// Copyright (c) 2014 Alexander A. Stepanov and Daniel E. Rose
//
// Permission to use, copy, modify, distribute and sell this software
// and its documentation for any purpose is hereby granted without
// fee, provided that the above copyright notice appear in all copies
// and that both that copyright notice and this permission notice
// appear in supporting documentation. The authors make no
// representations about the suitability of this software for any
// purpose. It is provided "as is" without express or implied
// warranty.
//
// This code accompanies the "fM2GP" book:
//
//	From Mathematics to Generic Programming
//	by Alexander Stepanov and Daniel E. Rose
//	Addison-Wesley Professional, 2015
//
// -------------------------------------------------------------------
// ch12.cpp -- For testing functions from Chapter 12 of fM2GP.
// -------------------------------------------------------------------
// Code corrected and test case changed December 2019.

#include <iostream>
#include "ch12.h"

int main() {
  std::cout << "stein_gcd(96, 84) = " << stein_gcd(96, 84) << std::endl;
  auto x = extended_gcd(96, 84);
  auto y = (x.second - 96 * x.first) / 84;
  std::cout << "extended_gcd(96, 84): gcd = " << x.first * 96 + y * 84 << std::endl;
}
