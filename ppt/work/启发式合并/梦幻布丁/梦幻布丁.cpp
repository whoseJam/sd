#include<iostream>
#include<cstring>
#include<cstdio>
#include<vector>
using namespace std;

const int N=1000005;
vector<int> pos[N];
int n,m,ans,now[N],col[N];

void Merge(int A,int B){	//A->B,siz[A]<=siz[B]
	vector<int>& posA=pos[A];
	vector<int>& posB=pos[B];
	for(auto p:posA){
		if(col[p-1]==B)ans--;
		if(col[p+1]==B)ans--;
	}
	for(auto p:posA)col[p]=B;
	for(auto p:posA)posB.push_back(p);
	posA.clear();
}

int main(){
	scanf("%d%d",&n,&m);
	for(int i=1;i<=n;i++){
		scanf("%d",&col[i]);
		if(col[i]!=col[i-1])ans++;
		pos[col[i]].push_back(i);
		now[col[i]]=col[i]; // now[x]：原始颜色为 x 的布丁当前的颜色
	}
	
	int opt,x,y;
	for(int i=1;i<=m;i++){
		scanf("%d",&opt);
		if(opt==2)printf("%d\n",ans);
		else{
			scanf("%d%d",&x,&y);
			if(x==y)continue;
			if(pos[now[x]].size()>pos[now[y]].size())
				swap(now[x],now[y]);
			Merge(now[x],now[y]);
		} 
	}
	return 0;
}
