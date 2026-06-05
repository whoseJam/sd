#include<bits/stdc++.h>
using namespace std;

int read(){
	int s=0,f=1;char t=getchar();
	while('0'>t||t>'9'){
		if(t=='-')f=-1;
		t=getchar();
	}
	while('0'<=t&&t<='9'){
		s=(s<<1)+(s<<3)+t-'0';
		t=getchar();
	}
	return s*f;
}

const int N=10005;
int fa[N];

int GetFa(int x){
	if(fa[x]==x)return x;
	return fa[x]=GetFa(fa[x]);
}

void Merge(int x,int y){
	int fx=GetFa(x),fy=GetFa(y);
	if(fx!=fy)fa[fx]=fy;
}

void Check(int x,int y){
	if(GetFa(x)==GetFa(y))cout<<"Y\n";
	else cout<<"N\n";
}

int main(){
	int n=read(),m=read();
	for(int i=1;i<=n;i++)fa[i]=i;
	for(int i=1,z,x,y;i<=m;i++){
		z=read();x=read();y=read();
		if(z==1)Merge(x,y);
		else Check(x,y);
	} 
	return 0;
}

