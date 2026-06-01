import { ArrayLayout } from "@/Array/ArrayLayout";
import { PileLayout } from "@/Array/PileLayout";
import { StackLayout } from "@/Array/StackLayout";
import { BezierLayout } from "@/Curve/BezierLayout";
import { BraceLayout } from "@/Curve/BraceLayout";
import { CurveLayout } from "@/Curve/CurveLayout";
import { VHBezierLayout } from "@/Curve/VHBezierLayout";
import { BipartiteGraphLayout } from "@/Graph/BipartiteGraphLayout";
import { DAGLayout } from "@/Graph/DAGLayout";
import { GridGraphLayout } from "@/Graph/GridGraphLayout";
import { TinyGraphLayout } from "@/Graph/TinyGraphLayout";
import { GridLayout } from "@/Grid/GridLayout";
import { AsideLayout } from "@/TwoNode/AsideLayout";
import {
  BackgroundLayout,
  CircleBackgroundLayout,
} from "@/TwoNode/BackgroundLayout";
import {
  CenterCircleContentFitLayout,
  CenterContentFitLayout,
  CenterEllipseContentFitLayout,
  CenterLayout,
  CenterRectContentFitLayout,
} from "@/TwoNode/CenterLayout";

const Layout = {
  ArrayLayout,
  StackLayout,
  PileLayout,
  BezierLayout,
  CurveLayout,
  VHBezierLayout,
  BraceLayout,
  GridLayout,
  TinyGraphLayout,
  GridGraphLayout,
  BipartiteGraphLayout,
  DAGLayout,
  CenterLayout,
  CenterContentFitLayout,
  CenterRectContentFitLayout,
  CenterCircleContentFitLayout,
  CenterEllipseContentFitLayout,
  AsideLayout,
  BackgroundLayout,
  CircleBackgroundLayout,
};

export function layout() {
  return Layout;
}
