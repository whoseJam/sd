import { ArrayLayout } from "@/Layout/Array/ArrayLayout";
import { PileLayout } from "@/Layout/Array/PileLayout";
import { StackLayout } from "@/Layout/Array/StackLayout";
import { BezierLayout } from "@/Layout/Curve/BezierLayout";
import { BraceLayout } from "@/Layout/Curve/BraceLayout";
import { CurveLayout } from "@/Layout/Curve/CurveLayout";
import { VHBezierLayout } from "@/Layout/Curve/VHBezierLayout";
import { BipartiteGraphLayout } from "@/Layout/Graph/BipartiteGraphLayout";
import { DAGLayout } from "@/Layout/Graph/DAGLayout";
import { GridGraphLayout } from "@/Layout/Graph/GridGraphLayout";
import { TinyGraphLayout } from "@/Layout/Graph/TinyGraphLayout";
import { GridLayout } from "@/Layout/Grid/GridLayout";
import { AsideLayout } from "@/Layout/TwoNode/AsideLayout";
import {
  BackgroundLayout,
  CircleBackgroundLayout,
} from "@/Layout/TwoNode/BackgroundLayout";
import {
  CenterCircleContentFitLayout,
  CenterContentFitLayout,
  CenterEllipseContentFitLayout,
  CenterLayout,
  CenterRectContentFitLayout,
} from "@/Layout/TwoNode/CenterLayout";

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
