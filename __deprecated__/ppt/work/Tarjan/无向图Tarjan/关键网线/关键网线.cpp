//
//  main.cpp
//  关键网线
//
//  Created by JLING on 2024/2/2.
//

#include <iostream>
#include <vector>
#include <algorithm>
#include <cstring>

using namespace std;

const int MAXN = 100005;
vector<int> graph[MAXN];
int dfn[MAXN], low[MAXN], timeStamp, totalA[MAXN], totalB[MAXN];
vector<pair<int, int>> bridges;
int nodeNum, edgeNum, type_Anum, type_Bnum;

void tarjan(int u, int himFather) {
    dfn[u] = low[u] = ++timeStamp;
    for (int v : graph[u]) {
        if (!dfn[v]) {
            tarjan(v, u);
            low[u] = min(low[u], low[v]);
            totalA[u] += totalA[v];
            totalB[u] += totalB[v];
            if (low[v] > dfn[u] && (totalA[v] == 0 || totalB[v] == 0 || totalA[v] == type_Anum || totalB[v] == type_Bnum)) {
                bridges.push_back({min(u, v), max(u, v)});
            }
        } else if (v != himFather) {
            low[u] = min(low[u], dfn[v]);
        }
    }
}

int main() {
    cin >> nodeNum >> edgeNum >> type_Anum >> type_Bnum;
    
    for (int i = 0, x; i < type_Anum; ++i) {
        cin >> x;
        totalA[x]++;
    }
    for (int i = 0, x; i < type_Bnum; ++i) {
        cin >> x;
        totalB[x]++;
    }
    for (int i = 0, u, v; i < edgeNum; ++i) {
        cin >> u >> v;
        graph[u].push_back(v);
        graph[v].push_back(u);
    }

    memset(dfn, 0, sizeof(dfn));
    memset(low, 0, sizeof(low));
    timeStamp = 0;
    
    tarjan(1, 0);

    cout << bridges.size() << endl;
    sort(bridges.begin(), bridges.end());
    
    // 我一定要用 aotu!!!
    for (auto bridge : bridges) {
        cout << bridge.first << ' ' << bridge.second << endl;
    }
    return 0;
}
