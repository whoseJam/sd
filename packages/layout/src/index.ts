import { ArrayLayout } from "@/array/array-layout";
import { PileLayout } from "@/array/pile-layout";
import { StackLayout } from "@/array/stack-layout";
import { BezierLayout } from "@/curve/bezier-layout";
import { BraceLayout } from "@/curve/brace-layout";
import { CurveLayout } from "@/curve/curve-layout";
import { VHBezierLayout } from "@/curve/vh-bezier-layout";
import { BipartiteGraphLayout } from "@/graph/bipartite-graph-layout";
import { DAGLayout } from "@/graph/dag-layout";
import { GridGraphLayout } from "@/graph/grid-graph-layout";
import { TinyGraphLayout } from "@/graph/tiny-graph-layout";
import { GridLayout } from "@/grid/grid-layout";
import { AsideLayout } from "@/two-node/aside-layout";
import {
  BackgroundLayout,
  CircleBackgroundLayout,
} from "@/two-node/background-layout";
import {
  CenterCircleContentFitLayout,
  CenterContentFitLayout,
  CenterEllipseContentFitLayout,
  CenterLayout,
  CenterRectContentFitLayout,
} from "@/two-node/center-layout";

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
